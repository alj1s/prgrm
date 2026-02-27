import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { Dumbbell, Settings } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { db } from '#/db/index'
import {
  userSettings as userSettingsTable,
  workoutSessions,
  workoutSets,
} from '#/db/schema'
import { auth } from '#/lib/auth'
import { authClient } from '#/lib/auth-client'
import { fetchAllNewHevyWorkouts, mapHevyExercise } from '#/lib/hevy'
import { getStrengthLevel } from '#/lib/strength-standards'
import { WorkoutCard } from '#/components/WorkoutCard'
import { SignInForm } from '#/components/SignInForm'

async function requireUser() {
  const { getRequest } = await import('@tanstack/start-server-core')
  const session = await auth.api.getSession({ headers: getRequest().headers })
  if (!session?.user) throw redirect({ to: '/sign-in' })
  return session.user
}

const deleteWorkoutSchema = z.object({ id: z.number().int().positive() })

const saveSettingsSchema = z.object({
  bodyweightKg: z.number().int().min(20).max(300),
  hevyApiKey: z.string().min(1),
})

const getPageData = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireUser()

  const settingsRows = await db
    .select()
    .from(userSettingsTable)
    .where(eq(userSettingsTable.userId, user.id))
  const settings = settingsRows.at(0) ?? null

  // Auto-sync Hevy workouts if configured
  if (settings?.hevyApiKey && settings.bodyweightKg != null) {
    try {
      const existingRows = await db
        .select({ hevyWorkoutId: workoutSessions.hevyWorkoutId })
        .from(workoutSessions)
        .where(eq(workoutSessions.userId, user.id))

      const existingIds = new Set(
        existingRows
          .map((r) => r.hevyWorkoutId)
          .filter((id): id is string => id != null),
      )

      const newWorkouts = await fetchAllNewHevyWorkouts(
        settings.hevyApiKey,
        existingIds,
      )

      for (const workout of newWorkouts) {
        const date = workout.start_time.slice(0, 10)
        const [inserted] = await db
          .insert(workoutSessions)
          .values({
            userId: user.id,
            date,
            bodyweightKg: settings.bodyweightKg,
            hevyWorkoutId: workout.id,
          })
          .returning({ id: workoutSessions.id })

        const setsToInsert = []
        for (const exercise of workout.exercises) {
          for (const set of exercise.sets) {
            if (set.type !== 'normal') continue
            const weightKg = set.weight_kg ?? 0
            const reps = set.reps ?? 0
            if (reps === 0) continue
            const mappedExercise = mapHevyExercise(exercise.title)
            const strengthLevel = getStrengthLevel(
              mappedExercise,
              settings.bodyweightKg,
              weightKg,
              reps,
            )
            setsToInsert.push({
              sessionId: inserted.id,
              exercise: mappedExercise,
              weightKg,
              reps,
              strengthLevel,
            })
          }
        }

        if (setsToInsert.length > 0) {
          await db.insert(workoutSets).values(setsToInsert)
        }
      }
    } catch (err) {
      console.error('Hevy sync failed:', err)
    }
  }

  const sessions = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, user.id))
    .orderBy(desc(workoutSessions.id))
    .limit(100)

  const sessionIds = sessions.map((s) => s.id)
  const sets =
    sessionIds.length > 0
      ? await db
          .select()
          .from(workoutSets)
          .where(inArray(workoutSets.sessionId, sessionIds))
      : []

  return {
    workouts: sessions.map((s) => ({
      ...s,
      sets: sets.filter((ws) => ws.sessionId === s.id),
    })),
    settings,
  }
})

const saveSettings = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => saveSettingsSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await requireUser()
    await db
      .insert(userSettingsTable)
      .values({
        userId: user.id,
        bodyweightKg: data.bodyweightKg,
        hevyApiKey: data.hevyApiKey,
      })
      .onConflictDoUpdate({
        target: userSettingsTable.userId,
        set: {
          bodyweightKg: data.bodyweightKg,
          hevyApiKey: data.hevyApiKey,
        },
      })
  })

const deleteWorkout = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteWorkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await requireUser()
    await db
      .delete(workoutSessions)
      .where(
        and(
          eq(workoutSessions.id, data.id),
          eq(workoutSessions.userId, user.id),
        ),
      )
  })

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getPageData(),
})

function SettingsForm({ onSaved }: { onSaved: () => void }) {
  const [bodyweightKg, setBodyweightKg] = useState('')
  const [hevyApiKey, setHevyApiKey] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings({
        data: {
          bodyweightKg: parseInt(bodyweightKg, 10),
          hevyApiKey,
        },
      })
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Setup</h2>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        Enter your bodyweight and Hevy API key to start syncing workouts
        automatically.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-300">Bodyweight (kg)</label>
          <input
            type="number"
            value={bodyweightKg}
            onChange={(e) => setBodyweightKg(e.target.value)}
            placeholder="79"
            min={20}
            max={300}
            required
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 w-32"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-300">Hevy API Key</label>
          <input
            type="text"
            value={hevyApiKey}
            onChange={(e) => setHevyApiKey(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
            className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="self-start bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save & Sync'}
        </button>
      </form>
    </div>
  )
}

function App() {
  const { workouts, settings } = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) return null
  if (!session?.user) return <SignInForm />

  const needsSetup = !settings?.bodyweightKg || !settings.hevyApiKey

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="w-7 h-7 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Recent Workouts</h1>
        </div>

        {needsSetup && <SettingsForm onSaved={() => router.invalidate()} />}

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
