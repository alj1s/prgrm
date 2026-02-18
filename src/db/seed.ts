import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.ts'

const db = drizzle(process.env.DATABASE_URL!, { schema })

const sessions = [
  {
    date: 'Feb 13, 2026',
    sets: [
      {
        exercise: 'Deadlift',
        weightLbs: 315,
        reps: 1,
        strengthLevel: 'Advanced',
      },
      {
        exercise: 'Barbell Row',
        weightLbs: 155,
        reps: 6,
        strengthLevel: 'Intermediate',
      },
      { exercise: 'Pull-ups', weightLbs: 0, reps: 10, strengthLevel: 'Novice' },
    ],
  },
  {
    date: 'Feb 15, 2026',
    sets: [
      {
        exercise: 'Squat',
        weightLbs: 245,
        reps: 3,
        strengthLevel: 'Intermediate',
      },
      {
        exercise: 'Romanian Deadlift',
        weightLbs: 185,
        reps: 6,
        strengthLevel: 'Novice',
      },
      {
        exercise: 'Leg Press',
        weightLbs: 360,
        reps: 10,
        strengthLevel: 'Intermediate',
      },
    ],
  },
  {
    date: 'Feb 17, 2026',
    sets: [
      {
        exercise: 'Bench Press',
        weightLbs: 185,
        reps: 5,
        strengthLevel: 'Intermediate',
      },
      {
        exercise: 'Incline Dumbbell Press',
        weightLbs: 70,
        reps: 8,
        strengthLevel: 'Novice',
      },
      {
        exercise: 'Tricep Pushdown',
        weightLbs: 55,
        reps: 12,
        strengthLevel: 'Novice',
      },
    ],
  },
]

async function main() {
  const userId = process.env.SEED_USER_ID
  if (!userId) throw new Error('SEED_USER_ID env var is required')

  for (const session of sessions) {
    const [{ id }] = await db
      .insert(schema.workoutSessions)
      .values({ userId, date: session.date })
      .returning({ id: schema.workoutSessions.id })

    await db
      .insert(schema.workoutSets)
      .values(session.sets.map((s) => ({ sessionId: id, ...s })))
  }
  console.log('Seeded workout data.')
}

main()
