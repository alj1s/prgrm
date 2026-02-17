import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { Dumbbell } from 'lucide-react'
import { db } from '#/db/index'
import { workoutSessions, workoutSets } from '#/db/schema'
import { cn } from '#/lib/utils'

const getWorkouts = createServerFn({ method: 'GET' }).handler(async () => {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .orderBy(desc(workoutSessions.id))

  const sets = await db.select().from(workoutSets)

  return sessions.map((session) => ({
    ...session,
    sets: sets.filter((s) => s.sessionId === session.id),
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
