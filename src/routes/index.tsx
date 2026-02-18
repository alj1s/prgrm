import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { ChevronDown, Dumbbell, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { db } from '#/db/index'
import { exercises, workoutSessions, workoutSets } from '#/db/schema'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { getStrengthLevel, type StrengthLevel } from '#/lib/strength-standards'

const getPageData = createServerFn({ method: 'GET' }).handler(async () => {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .orderBy(desc(workoutSessions.id))

  const sets = await db.select().from(workoutSets)
  const exerciseList = await db.select().from(exercises).orderBy(exercises.name)

  return {
    workouts: sessions.map((s) => ({
      ...s,
      sets: sets.filter((ws) => ws.sessionId === s.id),
    })),
    exercises: exerciseList,
    lastBodyweightKg: sessions[0]?.bodyweightKg ?? 79,
  }
})

const logWorkout = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      date: string
      bodyweightKg: number
      sets: { exercise: string; weightKg: number; reps: number; strengthLevel: string }[]
    }) => data,
  )
  .handler(async ({ data }) => {
    const [session] = await db
      .insert(workoutSessions)
      .values({ date: data.date, bodyweightKg: data.bodyweightKg })
      .returning({ id: workoutSessions.id })

    await db.insert(workoutSets).values(
      data.sets.map((s) => ({ sessionId: session.id, ...s })),
    )
  })

const deleteWorkout = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(workoutSessions).where(eq(workoutSessions.id, data.id))
  })

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getPageData(),
})

// Epley formula
function oneRepMax(weight: number, reps: number) {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

const strengthColors: Record<StrengthLevel, string> = {
  Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Novice: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
  Advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

const inputCls =
  'h-9 rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors'

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type SetRow = { exercise: string; weightKg: number; reps: number }

function computedStrengthLevel(row: SetRow, bodyweightKg: number): StrengthLevel {
  return getStrengthLevel(row.exercise, bodyweightKg, row.weightKg, row.reps)
}

function LogWorkoutForm({
  exerciseList,
  lastBodyweightKg,
  onSaved,
}: {
  exerciseList: { id: number; name: string; category: string }[]
  lastBodyweightKg: number
  onSaved: () => void
}) {
  const [date, setDate] = useState(todayLabel())
  const [bodyweightKg, setBodyweightKg] = useState(lastBodyweightKg)
  const [rows, setRows] = useState<SetRow[]>([
    { exercise: exerciseList[0]?.name ?? '', weightKg: 0, reps: 5 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addRow = () =>
    setRows((r) => [
      ...r,
      { exercise: r[r.length - 1]?.exercise ?? exerciseList[0]?.name ?? '', weightKg: 0, reps: 5 },
    ])

  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i))

  const updateRow = <K extends keyof SetRow>(i: number, key: K, value: SetRow[K]) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await logWorkout({
        data: {
          date,
          bodyweightKg,
          sets: rows.map((r) => ({ ...r, strengthLevel: computedStrengthLevel(r, bodyweightKg) })),
        },
      })
      onSaved()
    } catch {
      setError('Failed to save workout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const byCategory = exerciseList.reduce<Record<string, typeof exerciseList>>((acc, ex) => {
    ;(acc[ex.category] ??= []).push(ex)
    return acc
  }, {})

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden mb-6"
    >
      <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300 shrink-0">Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={cn(inputCls, 'w-44')}
            placeholder="Feb 17, 2026"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300 shrink-0">Body weight</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={40}
              max={180}
              step={1}
              value={bodyweightKg}
              onChange={(e) => setBodyweightKg(Number(e.target.value))}
              className={cn(inputCls, 'w-20')}
            />
            <span className="text-sm text-slate-400">kg</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-700/50">
              <th className="px-5 py-3 font-medium">Exercise</th>
              <th className="px-5 py-3 font-medium">Weight (kg)</th>
              <th className="px-5 py-3 font-medium">Reps</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const level = computedStrengthLevel(row, bodyweightKg)
              return (
                <tr key={i} className="border-b border-slate-700/30 last:border-0">
                  <td className="px-5 py-2.5">
                    <div className="relative w-56">
                      <select
                        value={row.exercise}
                        onChange={(e) => updateRow(i, 'exercise', e.target.value)}
                        className={cn(inputCls, 'w-full appearance-none pr-8')}
                        required
                      >
                        {Object.entries(byCategory).map(([cat, exs]) => (
                          <optgroup key={cat} label={cat}>
                            {exs.map((ex) => (
                              <option key={ex.id} value={ex.name}>
                                {ex.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={row.weightKg}
                      onChange={(e) => updateRow(i, 'weightKg', Number(e.target.value))}
                      className={cn(inputCls, 'w-24')}
                    />
                  </td>
                  <td className="px-5 py-2.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={row.reps}
                      onChange={(e) => updateRow(i, 'reps', Number(e.target.value))}
                      className={cn(inputCls, 'w-20')}
                      required
                    />
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        strengthColors[level],
                      )}
                    >
                      {level}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add set
        </button>

        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="h-9 px-5 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
          >
            {loading ? 'Saving…' : 'Save workout'}
          </button>
        </div>
      </div>
    </form>
  )
}

type Workout = Awaited<ReturnType<typeof getPageData>>['workouts'][number]

function WorkoutCard({ session, onDeleted }: { session: Workout; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteWorkout({ data: { id: session.id } })
      onDeleted()
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          {session.date} · {session.bodyweightKg} kg
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-50 transition-colors"
          aria-label="Delete workout"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-700/50">
            <th className="px-5 py-3 font-medium">Exercise</th>
            <th className="px-5 py-3 font-medium text-right">Weight</th>
            <th className="px-5 py-3 font-medium text-right">Reps</th>
            <th className="px-5 py-3 font-medium text-right">Est. 1RM</th>
            <th className="px-5 py-3 font-medium text-right">Level</th>
          </tr>
        </thead>
        <tbody>
          {session.sets.map((set) => {
            const orm = oneRepMax(set.weightKg, set.reps)
            const level = set.strengthLevel as StrengthLevel
            return (
              <tr
                key={set.id}
                className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-5 py-3.5 text-white font-medium">{set.exercise}</td>
                <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">
                  {set.weightKg > 0 ? `${set.weightKg} kg` : 'BW'}
                </td>
                <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">{set.reps}</td>
                <td className="px-5 py-3.5 text-cyan-400 text-right tabular-nums font-medium">
                  {set.weightKg > 0 ? `${orm} kg` : '—'}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={cn(
                      'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      strengthColors[level],
                    )}
                  >
                    {set.strengthLevel}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const { workouts, exercises: exerciseList, lastBodyweightKg } = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  if (isPending) return null
  if (!session?.user) return <SignInForm />

  const handleSaved = () => {
    setShowForm(false)
    router.invalidate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Recent Workouts</h1>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className={cn(
              'flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-colors',
              showForm
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white',
            )}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Log workout
              </>
            )}
          </button>
        </div>

        {showForm && (
          <LogWorkoutForm
            exerciseList={exerciseList}
            lastBodyweightKg={lastBodyweightKg}
            onSaved={handleSaved}
          />
        )}

        <div className="flex flex-col gap-6">
          {workouts.map((session) => (
            <WorkoutCard key={session.id} session={session} onDeleted={() => router.invalidate()} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SignInForm() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({ email, password, name })
        if (result.error) setError(result.error.message || 'Sign up failed')
        else router.invalidate()
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) setError(result.error.message || 'Sign in failed')
        else router.invalidate()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Dumbbell className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-white">progrm</span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          <h1 className="text-lg font-semibold text-white mb-1">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {isSignUp
              ? 'Sign up to start tracking your workouts'
              : 'Sign in to your account'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={cn(inputCls, 'w-full')}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(inputCls, 'w-full')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={cn(inputCls, 'w-full')}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-9 w-full rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
            >
              {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
