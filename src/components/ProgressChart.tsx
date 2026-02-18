import { strengthLevelColor } from '#/lib/strength-standards'
import type { StrengthLevel } from '#/lib/strength-standards'

export type ChartDataPoint = {
  date: string
  value: number
  level: StrengthLevel
}

const VW = 560
const VH = 110
const PAD_L = 4
const PAD_R = 4
const PAD_T = 26 // room for level labels
const PAD_B = 20 // room for date labels
const CW = VW - PAD_L - PAD_R
const CH = VH - PAD_T - PAD_B

function xOf(i: number, n: number) {
  return PAD_L + (n === 1 ? CW / 2 : (i / (n - 1)) * CW)
}

function yOf(v: number, minV: number, range: number) {
  const pct = range === 0 ? 0.5 : (v - minV) / range
  // 10% vertical margin so dots don't sit on the baseline
  return PAD_T + CH - (pct * CH * 0.8 + CH * 0.1)
}

export function ProgressChart({ points }: { points: ChartDataPoint[] }) {
  const n = points.length
  const values = points.map((p) => p.value)
  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const range = maxV - minV

  const xs = points.map((_, i) => xOf(i, n))
  const ys = points.map((p) => yOf(p.value, minV, range))

  const linePath = points
    .map(
      (_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`,
    )
    .join(' ')
  const areaPath = `${linePath} L${xs[n - 1].toFixed(1)},${(PAD_T + CH).toFixed(1)} L${xs[0].toFixed(1)},${(PAD_T + CH).toFixed(1)} Z`

  const changes: number[] = []
  for (let i = 1; i < n; i++) {
    if (points[i].level !== points[i - 1].level) changes.push(i)
  }

  const labelIndices = [0, ...changes]

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      height={VH}
      preserveAspectRatio="none"
    >
      {/* Baseline */}
      <line
        x1={PAD_L}
        y1={PAD_T + CH}
        x2={VW - PAD_R}
        y2={PAD_T + CH}
        stroke="#1e293b"
        strokeWidth="1.5"
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
          x1={xs[i]}
          y1={PAD_T + 2}
          x2={xs[i]}
          y2={PAD_T + CH}
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ))}

      {/* Dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={xs[i]}
          cy={ys[i]}
          r="4.5"
          fill={strengthLevelColor[p.level]}
          stroke="#0f172a"
          strokeWidth="2"
        />
      ))}

      {/* Level labels */}
      {labelIndices.map((i) => {
        const p = points[i]
        const isFirst = i === 0
        const isLast = i === n - 1
        const anchor =
          isFirst && !isLast ? 'start' : !isFirst && isLast ? 'end' : 'middle'
        const x = isFirst
          ? Math.max(xs[i], PAD_L)
          : isLast
            ? Math.min(xs[i], VW - PAD_R)
            : xs[i]
        return (
          <text
            key={i}
            x={x.toFixed(1)}
            y={PAD_T - 7}
            textAnchor={anchor}
            fill={strengthLevelColor[p.level]}
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui,sans-serif"
          >
            {isFirst ? p.level : `→ ${p.level}`}
          </text>
        )
      })}

      {/* Date labels: first and last */}
      <text
        x={xs[0].toFixed(1)}
        y={VH - 3}
        textAnchor="start"
        fill="#475569"
        fontSize="9.5"
        fontFamily="system-ui,sans-serif"
      >
        {points[0].date}
      </text>
      {n > 1 && (
        <text
          x={xs[n - 1].toFixed(1)}
          y={VH - 3}
          textAnchor="end"
          fill="#475569"
          fontSize="9.5"
          fontFamily="system-ui,sans-serif"
        >
          {points[n - 1].date}
        </text>
      )}
    </svg>
  )
}
