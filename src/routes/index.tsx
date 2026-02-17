import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { Dumbbell } from 'lucide-react'
import { useState } from 'react'
import { db } from '#/db/index'
import { workoutSessions, workoutSets } from '#/db/schema'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'

const getWorkouts = createServerFn({ method: 'GET' }).handler(async () => {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .orderBy(desc(workoutSessions.id))

  const sets = await db.select().from(workoutSets)

  return sessions.map((s) => ({
    ...s,
    sets: sets.filter((ws) => ws.sessionId === s.id),
  }))
})

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getWorkouts(),
})

// Epley formula
function oneRepMax(weight: number, reps: number) {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

type StrengthLevel = 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Elite'

const strengthColors: Record<StrengthLevel, string> = {
  Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Novice: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
  Advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

function App() {
  const workouts = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null
  if (!session?.user) return <SignInForm />

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="w-7 h-7 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Recent Workouts</h1>
        </div>

        <div className="flex flex-col gap-6">
          {workouts.map((session) => (
            <div
              key={session.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80">
                <span className="text-sm font-medium text-slate-300">{session.date}</span>
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
                    const orm = oneRepMax(set.weightLbs, set.reps)
                    const level = set.strengthLevel as StrengthLevel
                    return (
                      <tr
                        key={set.id}
                        className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-white font-medium">{set.exercise}</td>
                        <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">
                          {set.weightLbs > 0 ? `${set.weightLbs} lbs` : 'BW'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">
                          {set.reps}
                        </td>
                        <td className="px-5 py-3.5 text-cyan-400 text-right tabular-nums font-medium">
                          {set.weightLbs > 0 ? `${orm} lbs` : '—'}
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
                  className="h-9 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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
                className="h-9 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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
                className="h-9 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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
