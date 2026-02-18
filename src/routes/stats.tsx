import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { asc, eq, inArray } from 'drizzle-orm'
import { db } from '#/db/index'
import { workoutSessions, workoutSets } from '#/db/schema'
import { auth } from '#/lib/auth'
import { authClient } from '#/lib/auth-client'
import { BODYWEIGHT_EXERCISES } from '#/lib/strength-standards'
import type { StrengthLevel } from '#/lib/strength-standards'
import { oneRepMax } from '#/lib/workout'
import { ProgressChart } from '#/components/ProgressChart'
import type { ChartDataPoint } from '#/components/ProgressChart'
import { StrengthBadge } from '#/components/StrengthBadge'

async function requireUser() {
  const { getRequest } = await import('@tanstack/start-server-core')
  const session = await auth.api.getSession({ headers: getRequest().headers })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

const getStatsData = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await requireUser()

  const sessions = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, user.id))
    .orderBy(asc(workoutSessions.id))

  const sessionIds = sessions.map((s) => s.id)
  const sets =
    sessionIds.length > 0
      ? await db
          .select()
          .from(workoutSets)
          .where(inArray(workoutSets.sessionId, sessionIds))
      : []

  // Build per-exercise timeline (oldest → newest)
  const exerciseMap = new Map<string, ChartDataPoint[]>()

  for (const session of sessions) {
    const sessionSets = sets.filter((s) => s.sessionId === session.id)

    const byEx = new Map<string, typeof sessionSets>()
    for (const set of sessionSets) {
      const existing = byEx.get(set.exercise) ?? []
      existing.push(set)
      byEx.set(set.exercise, existing)
    }

    for (const [exercise, exSets] of byEx) {
      const isBW = BODYWEIGHT_EXERCISES.has(exercise)
      const best = exSets.reduce((b, s) => {
        const sv = isBW ? s.reps : oneRepMax(s.weightKg, s.reps)
        const bv = isBW ? b.reps : oneRepMax(b.weightKg, b.reps)
        return sv > bv ? s : b
      })
      const value = isBW ? best.reps : oneRepMax(best.weightKg, best.reps)
      const pts = exerciseMap.get(exercise) ?? []
      pts.push({
        date: session.date,
        value,
        level: best.strengthLevel as StrengthLevel,
      })
      exerciseMap.set(exercise, pts)
    }
  }

  return {
    exercises: Array.from(exerciseMap.entries())
      .map(([exercise, points]) => ({
        exercise,
        points,
        isBodyweight: BODYWEIGHT_EXERCISES.has(exercise),
      }))
      .sort(
        (a, b) =>
          b.points.length - a.points.length ||
          a.exercise.localeCompare(b.exercise),
      ),
  }
})

export const Route = createFileRoute('/stats')({
  component: StatsPage,
  loader: () => getStatsData(),
})

function StatsPage() {
  const { exercises } = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Sign in to view your stats.</p>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">
          No workout data yet — start logging workouts!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Stats</h1>

        <div className="flex flex-col gap-5">
          {exercises.map(({ exercise, points, isBodyweight }) => {
            const latest = points[points.length - 1]
            const unit = isBodyweight ? 'reps' : 'kg 1RM'

            return (
              <div
                key={exercise}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
                  <span className="font-semibold text-white">{exercise}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 tabular-nums">
                      {latest.value} {unit}
                    </span>
                    <StrengthBadge level={latest.level} />
                  </div>
                </div>

                <div className="px-4 py-3">
                  {points.length === 1 ? (
                    <p className="text-sm text-slate-600 text-center py-2">
                      Log this exercise again to see your progression.
                    </p>
                  ) : (
                    <ProgressChart points={points} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
