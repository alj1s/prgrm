import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { oneRepMax } from '#/lib/workout'
import type { StrengthLevel } from '#/lib/strength-standards'
import { StrengthBadge } from './StrengthBadge'

export type WorkoutSession = {
  id: number
  date: string
  bodyweightKg: number
  sets: {
    id: number
    exercise: string
    weightKg: number
    reps: number
    strengthLevel: string
  }[]
}

export function WorkoutCard({
  session,
  onDelete,
}: {
  session: WorkoutSession
  onDelete: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete()
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
                <td className="px-5 py-3.5 text-white font-medium">
                  {set.exercise}
                </td>
                <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">
                  {set.weightKg > 0 ? `${set.weightKg} kg` : 'BW'}
                </td>
                <td className="px-5 py-3.5 text-slate-300 text-right tabular-nums">
                  {set.reps}
                </td>
                <td className="px-5 py-3.5 text-cyan-400 text-right tabular-nums font-medium">
                  {set.weightKg > 0 ? `${orm} kg` : '—'}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <StrengthBadge level={level} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
