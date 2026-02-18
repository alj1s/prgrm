import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { db } from '#/db/index'
import { workoutSessions, workoutSets } from '#/db/schema'
import { authClient } from '#/lib/auth-client'
import { BODYWEIGHT_EXERCISES, type StrengthLevel } from '#/lib/strength-standards'
import { cn } from '#/lib/utils'

function oneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

const levelColor: Record<StrengthLevel, string> = {
  Beginner:     '#94a3b8',
  Novice:       '#60a5fa',
  Intermediate: '#4ade80',
  Advanced:     '#fb923c',
  Elite:        '#c084fc',
}

const levelBadge: Record<StrengthLevel, string> = {
  Beginner:     'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Novice:       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
  Advanced:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite:        'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

type DataPoint = { date: string; value: number; level: StrengthLevel }

const getStatsData = createServerFn({ method: 'GET' }).handler(async () => {
  const sessions = await db.select().from(workoutSessions).orderBy(asc(workoutSessions.id))
  const sets = await db.select().from(workoutSets)

  // Build per-exercise timeline (oldest → newest)
  const exerciseMap = new Map<string, DataPoint[]>()

  for (const session of sessions) {
    const sessionSets = sets.filter((s) => s.sessionId === session.id)

    // Group sets by exercise
    const byEx = new Map<string, typeof sessionSets>()
    for (const set of sessionSets) {
      const existing = byEx.get(set.exercise) ?? []
      existing.push(set)
      byEx.set(set.exercise, existing)
    }

    // For each exercise: pick the set with the best 1RM (or most reps for bodyweight)
    for (const [exercise, exSets] of byEx) {
      const isBW = BODYWEIGHT_EXERCISES.has(exercise)
      const best = exSets.reduce((b, s) => {
        const sv = isBW ? s.reps : oneRepMax(s.weightKg, s.reps)
        const bv = isBW ? b.reps : oneRepMax(b.weightKg, b.reps)
        return sv > bv ? s : b
      })
      const value = isBW ? best.reps : oneRepMax(best.weightKg, best.reps)
      const pts = exerciseMap.get(exercise) ?? []
      pts.push({ date: session.date, value, level: best.strengthLevel as StrengthLevel })
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
      // Most frequently logged first; alphabetical tiebreak
      .sort((a, b) => b.points.length - a.points.length || a.exercise.localeCompare(b.exercise)),
  }
})

export const Route = createFileRoute('/stats')({
  component: StatsPage,
  loader: () => getStatsData(),
})

// ─── Chart ──────────────────────────────────────────────────────────────────

const VW = 560
const VH = 110
const PAD_L = 4
const PAD_R = 4
const PAD_T = 26  // room for level labels
const PAD_B = 20  // room for date labels
const CW = VW - PAD_L - PAD_R
const CH = VH - PAD_T - PAD_B

function xOf(i: number, n: number) {
  return PAD_L + (n === 1 ? CW / 2 : (i / (n - 1)) * CW)
}

function yOf(v: number, minV: number, range: number) {
  const pct = range === 0 ? 0.5 : (v - minV) / range
  // 10% vertical margin inside the chart area so dots don't sit on the baseline
  return PAD_T + CH - (pct * CH * 0.8 + CH * 0.1)
}

function ProgressChart({ points }: { points: DataPoint[] }) {
  const n = points.length
  const values = points.map((p) => p.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const range = maxV - minV

  const xs = points.map((_, i) => xOf(i, n))
  const ys = points.map((p) => yOf(p.value, minV, range))

  const linePath = points.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${xs[n - 1].toFixed(1)},${(PAD_T + CH).toFixed(1)} L${xs[0].toFixed(1)},${(PAD_T + CH).toFixed(1)} Z`

  // Indices where the strength level changed
  const changes: number[] = []
  for (let i = 1; i < n; i++) {
    if (points[i].level !== points[i - 1].level) changes.push(i)
  }

  // Show a label at index 0 and at each change
  const labelIndices = [0, ...changes]

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height={VH} preserveAspectRatio="none">
      {/* Baseline */}
      <line
        x1={PAD_L} y1={PAD_T + CH}
        x2={VW - PAD_R} y2={PAD_T + CH}
        stroke="#1e293b" strokeWidth="1.5"
      />

      {/* Area fill */}
      {n > 1 && <path d={areaPath} fill="#22d3ee" opacity="0.07" />}

      {/* Line */}
      {n > 1 && (
        <path
          d={linePath}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Dashed verticals at level changes */}
      {changes.map((i) => (
        <line
          key={i}
          x1={xs[i]} y1={PAD_T + 2}
          x2={xs[i]} y2={PAD_T + CH}
          stroke="#475569" strokeWidth="1" strokeDasharray="3 3"
        />
      ))}

      {/* Dots (on top of the line) */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={xs[i]} cy={ys[i]} r="4.5"
          fill={levelColor[p.level]}
          stroke="#0f172a" strokeWidth="2"
        />
      ))}

      {/* Level labels */}
      {labelIndices.map((i) => {
        const p = points[i]
        const isFirst = i === 0
        const isLast = i === n - 1
        // anchor: start for first point, end for last, middle for changes in between
        const anchor = isFirst && !isLast ? 'start' : !isFirst && isLast ? 'end' : 'middle'
        const x = isFirst ? Math.max(xs[i], PAD_L) : isLast ? Math.min(xs[i], VW - PAD_R) : xs[i]
        return (
          <text
            key={i}
            x={x.toFixed(1)} y={PAD_T - 7}
            textAnchor={anchor}
            fill={levelColor[p.level]}
            fontSize="10" fontWeight="600" fontFamily="system-ui,sans-serif"
          >
            {isFirst ? p.level : `→ ${p.level}`}
          </text>
        )
      })}

      {/* Date labels: first and last session */}
      <text
        x={xs[0].toFixed(1)} y={VH - 3}
        textAnchor="start" fill="#475569"
        fontSize="9.5" fontFamily="system-ui,sans-serif"
      >
        {points[0].date}
      </text>
      {n > 1 && (
        <text
          x={xs[n - 1].toFixed(1)} y={VH - 3}
          textAnchor="end" fill="#475569"
          fontSize="9.5" fontFamily="system-ui,sans-serif"
        >
          {points[n - 1].date}
        </text>
      )}
    </svg>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

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
        <p className="text-slate-400">No workout data yet — start logging workouts!</p>
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
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        levelBadge[latest.level],
                      )}
                    >
                      {latest.level}
                    </span>
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
