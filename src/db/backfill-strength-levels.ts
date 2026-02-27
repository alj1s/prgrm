import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from './index.ts'
import { workoutSessions, workoutSets } from './schema.ts'
import { getStrengthLevel } from '../lib/strength-standards.ts'
import { mapHevyExercise } from '../lib/hevy.ts'

const sessions = await db.select().from(workoutSessions)
const sets = await db.select().from(workoutSets)

const bodyweightBySession = new Map(sessions.map((s) => [s.id, s.bodyweightKg]))

let updated = 0
for (const set of sets) {
  const bodyweightKg = bodyweightBySession.get(set.sessionId) ?? 79
  const mappedExercise = mapHevyExercise(set.exercise)
  const correct = getStrengthLevel(
    mappedExercise,
    bodyweightKg,
    set.weightKg,
    set.reps,
  )

  const exerciseChanged = mappedExercise !== set.exercise
  const levelChanged = correct !== set.strengthLevel

  if (exerciseChanged || levelChanged) {
    await db
      .update(workoutSets)
      .set({ exercise: mappedExercise, strengthLevel: correct })
      .where(eq(workoutSets.id, set.id))
    const parts = []
    if (exerciseChanged)
      parts.push(`exercise: "${set.exercise}" → "${mappedExercise}"`)
    if (levelChanged) parts.push(`level: ${set.strengthLevel} → ${correct}`)
    console.log(`set ${set.id}: ${parts.join(', ')}`)
    updated++
  }
}

console.log(`\nDone. Updated ${updated} / ${sets.length} sets.`)
