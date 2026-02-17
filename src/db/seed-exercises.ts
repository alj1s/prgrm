import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.ts'

const db = drizzle(process.env.DATABASE_URL!, { schema })

const exercises: { name: string; category: string }[] = [
  // Barbell
  { name: 'Bench Press', category: 'Barbell' },
  { name: 'Squat', category: 'Barbell' },
  { name: 'Deadlift', category: 'Barbell' },
  { name: 'Shoulder Press', category: 'Barbell' },
  { name: 'Barbell Curl', category: 'Barbell' },
  { name: 'Bent Over Row', category: 'Barbell' },
  { name: 'Incline Bench Press', category: 'Barbell' },
  { name: 'Front Squat', category: 'Barbell' },
  { name: 'Hex Bar Deadlift', category: 'Barbell' },
  { name: 'Hip Thrust', category: 'Barbell' },
  { name: 'Romanian Deadlift', category: 'Barbell' },
  { name: 'Power Clean', category: 'Barbell' },
  { name: 'Military Press', category: 'Barbell' },
  { name: 'Sumo Deadlift', category: 'Barbell' },
  { name: 'Clean and Jerk', category: 'Barbell' },
  { name: 'EZ Bar Curl', category: 'Barbell' },
  { name: 'Lying Tricep Extension', category: 'Barbell' },
  { name: 'Close Grip Bench Press', category: 'Barbell' },
  { name: 'Snatch', category: 'Barbell' },
  { name: 'Preacher Curl', category: 'Barbell' },
  { name: 'Seated Shoulder Press', category: 'Barbell' },
  { name: 'Barbell Shrug', category: 'Barbell' },
  { name: 'T Bar Row', category: 'Barbell' },
  { name: 'Clean', category: 'Barbell' },
  { name: 'Push Press', category: 'Barbell' },
  { name: 'Smith Machine Bench Press', category: 'Barbell' },
  { name: 'Decline Bench Press', category: 'Barbell' },
  // Bodyweight
  { name: 'Pull Ups', category: 'Bodyweight' },
  { name: 'Push Ups', category: 'Bodyweight' },
  { name: 'Dips', category: 'Bodyweight' },
  { name: 'Chin Ups', category: 'Bodyweight' },
  { name: 'Crunches', category: 'Bodyweight' },
  { name: 'Sit Ups', category: 'Bodyweight' },
  { name: 'Muscle Ups', category: 'Bodyweight' },
  { name: 'Bodyweight Squat', category: 'Bodyweight' },
  { name: 'One Arm Push Ups', category: 'Bodyweight' },
  { name: 'Neutral Grip Pull Ups', category: 'Bodyweight' },
  { name: 'Diamond Push Ups', category: 'Bodyweight' },
  // Dumbbell
  { name: 'Dumbbell Bench Press', category: 'Dumbbell' },
  { name: 'Dumbbell Curl', category: 'Dumbbell' },
  { name: 'Incline Dumbbell Bench Press', category: 'Dumbbell' },
  { name: 'Dumbbell Shoulder Press', category: 'Dumbbell' },
  { name: 'Dumbbell Lateral Raise', category: 'Dumbbell' },
  { name: 'Dumbbell Row', category: 'Dumbbell' },
  { name: 'Hammer Curl', category: 'Dumbbell' },
  { name: 'Seated Dumbbell Shoulder Press', category: 'Dumbbell' },
  { name: 'Dumbbell Bulgarian Split Squat', category: 'Dumbbell' },
  { name: 'Goblet Squat', category: 'Dumbbell' },
  { name: 'Dumbbell Fly', category: 'Dumbbell' },
  { name: 'Dumbbell Shrug', category: 'Dumbbell' },
  // Machine
  { name: 'Sled Leg Press', category: 'Machine' },
  { name: 'Leg Extension', category: 'Machine' },
  { name: 'Horizontal Leg Press', category: 'Machine' },
  { name: 'Chest Press', category: 'Machine' },
  { name: 'Hack Squat', category: 'Machine' },
  { name: 'Machine Shoulder Press', category: 'Machine' },
  { name: 'Machine Chest Fly', category: 'Machine' },
  { name: 'Seated Leg Curl', category: 'Machine' },
  { name: 'Lying Leg Curl', category: 'Machine' },
  { name: 'Machine Calf Raise', category: 'Machine' },
  { name: 'Hip Adduction', category: 'Machine' },
  // Cable
  { name: 'Lat Pulldown', category: 'Cable' },
  { name: 'Tricep Pushdown', category: 'Cable' },
  { name: 'Seated Cable Row', category: 'Cable' },
]

async function main() {
  await db.insert(schema.exercises).values(exercises).onConflictDoNothing()
  console.log(`Seeded ${exercises.length} exercises.`)
}

main()
