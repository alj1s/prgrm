import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn, inputCls } from '#/lib/utils'
import { getStrengthLevel, type StrengthLevel } from '#/lib/strength-standards'
import { oneRepMax } from '#/lib/workout'
import { StrengthBadge } from './StrengthBadge'

type SetRow = { exercise: string; weightKg: number | undefined; reps: number | undefined }

function computedStrengthLevel(row: SetRow, bodyweightKg: number): StrengthLevel {
  return getStrengthLevel(row.exercise, bodyweightKg, row.weightKg ?? 0, row.reps ?? 0)
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export type LogWorkoutData = {
  date: string
  bodyweightKg: number
  sets: { exercise: string; weightKg: number; reps: number; strengthLevel: string }[]
}

export function LogWorkoutForm({
  exerciseList,
  lastBodyweightKg,
  onSubmit,
}: {
  exerciseList: { id: number; name: string; category: string }[]
  lastBodyweightKg: number
  onSubmit: (data: LogWorkoutData) => Promise<void>
}) {
  const [date, setDate] = useState(todayLabel())
  const [bodyweightKg, setBodyweightKg] = useState<number | undefined>(lastBodyweightKg)
  const [rows, setRows] = useState<SetRow[]>([
    { exercise: exerciseList[0]?.name ?? '', weightKg: 0, reps: 5 },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addRow = () =>
    setRows((r) => [
      ...r,
      { exercise: r[r.length - 1]?.exercise ?? exerciseList[0]?.name ?? '', weightKg: undefined, reps: undefined },
    ])

  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i))

  const updateRow = <K extends keyof SetRow>(i: number, key: K, value: SetRow[K]) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        date,
        bodyweightKg: bodyweightKg ?? lastBodyweightKg,
        sets: rows.map((r) => ({
          exercise: r.exercise,
          weightKg: r.weightKg ?? 0,
          reps: r.reps ?? 0,
          strengthLevel: computedStrengthLevel(r, bodyweightKg ?? lastBodyweightKg),
        })),
      })
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
              value={bodyweightKg ?? ''}
              onChange={(e) => setBodyweightKg(e.target.value === '' ? undefined : Number(e.target.value))}
              className={cn(inputCls, 'w-20')}
            />
            <span className="text-sm text-slate-400">kg</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-700/50">
              <th className="px-5 py-3 font-medium w-72">Exercise</th>
              <th className="px-5 py-3 font-medium w-36">Weight (kg)</th>
              <th className="px-5 py-3 font-medium w-24">Reps</th>
              <th className="px-5 py-3 font-medium w-28 text-right">Est. 1RM</th>
              <th className="px-5 py-3 font-medium w-36">Level</th>
              <th className="px-2 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const level = computedStrengthLevel(row, bodyweightKg ?? lastBodyweightKg)
              const weightKg = row.weightKg ?? 0
              const reps = row.reps ?? 0
              const orm = weightKg > 0 ? oneRepMax(weightKg, reps) : null
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
                      value={row.weightKg ?? ''}
                      onChange={(e) => updateRow(i, 'weightKg', e.target.value === '' ? undefined : Number(e.target.value))}
                      className={cn(inputCls, 'w-24')}
                    />
                  </td>
                  <td className="px-5 py-2.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={row.reps ?? ''}
                      onChange={(e) => updateRow(i, 'reps', e.target.value === '' ? undefined : Number(e.target.value))}
                      className={cn(inputCls, 'w-20')}
                      required
                    />
                  </td>
                  <td className="px-5 py-2.5 text-cyan-400 text-right tabular-nums font-medium">
                    {orm !== null ? `${orm} kg` : '—'}
                  </td>
                  <td className="px-5 py-2.5">
                    <StrengthBadge level={level} />
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
