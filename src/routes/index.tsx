import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { Dumbbell, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { db } from '#/db/index'
import { exercises, workoutSessions, workoutSets } from '#/db/schema'
import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { LogWorkoutForm, type LogWorkoutData } from '#/components/LogWorkoutForm'
import { WorkoutCard } from '#/components/WorkoutCard'
import { SignInForm } from '#/components/SignInForm'

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

function App() {
  const { workouts, exercises: exerciseList, lastBodyweightKg } = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  if (isPending) return null
  if (!session?.user) return <SignInForm />

  const handleSubmit = async (data: LogWorkoutData) => {
    await logWorkout({ data })
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
            onSubmit={handleSubmit}
          />
        )}

        <div className="flex flex-col gap-6">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              session={workout}
              onDelete={async () => {
                await deleteWorkout({ data: { id: workout.id } })
                router.invalidate()
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
