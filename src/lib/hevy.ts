const HEVY_BASE = 'https://api.hevyapp.com/v1'

export interface HevySet {
  type: 'warmup' | 'normal' | 'failure'
  weight_kg: number | null
  reps: number | null
}

export interface HevyExercise {
  title: string
  sets: HevySet[]
}

export interface HevyWorkout {
  id: string
  start_time: string // ISO 8601
  exercises: HevyExercise[]
}

interface HevyWorkoutsResponse {
  page: number
  page_count: number
  workouts: HevyWorkout[]
}

export async function fetchHevyWorkoutsPage(
  apiKey: string,
  page: number,
  pageSize = 10,
): Promise<{ page_count: number; workouts: HevyWorkout[] }> {
  const res = await fetch(
    `${HEVY_BASE}/workouts?page=${page}&pageSize=${pageSize}`,
    { headers: { 'api-key': apiKey } },
  )
  if (!res.ok) throw new Error(`Hevy API error: ${res.status}`)
  const data = (await res.json()) as HevyWorkoutsResponse
  return { page_count: data.page_count, workouts: data.workouts }
}

export async function fetchAllNewHevyWorkouts(
  apiKey: string,
  existingIds: Set<string>,
): Promise<HevyWorkout[]> {
  const newWorkouts: HevyWorkout[] = []
  let page = 1
  let done = false

  while (!done) {
    const { page_count, workouts } = await fetchHevyWorkoutsPage(apiKey, page)
    for (const workout of workouts) {
      if (existingIds.has(workout.id)) {
        done = true
        break
      }
      newWorkouts.push(workout)
    }
    if (!done && page >= page_count) done = true
    page++
  }

  // Return oldest first for stable insertion
  return newWorkouts.reverse()
}

const HEVY_EXERCISE_MAP: Record<string, string> = {
  'Barbell Bench Press': 'Bench Press',
  'Bench Press (Barbell)': 'Bench Press',
  'Barbell Back Squat': 'Squat',
  'Squat (Barbell)': 'Squat',
  'Deadlift (Barbell)': 'Deadlift',
  'Overhead Press (Barbell)': 'Shoulder Press',
  'Leg Press (Machine)': 'Sled Leg Press',
  'Calf Press (Machine)': 'Sled Press Calf Raise',
  'Lat Pulldown (Cable)': 'Lat Pulldown',
  'Seated Row (Cable)': 'Seated Cable Row',
  'Tricep Pushdown (Cable - Bar)': 'Tricep Pushdown',
  'Bicep Curl (Barbell)': 'Barbell Curl',
  'Bent Over Row (Barbell)': 'Bent Over Row',
  'Romanian Deadlift (Barbell)': 'Romanian Deadlift',
  'Hip Thrust (Barbell)': 'Hip Thrust',
  'Pull-ups': 'Pull Ups',
  'Chin-ups': 'Chin Ups',
  'Barbell Row': 'Bent Over Row',
  'Bench Press (Smith Machine)': 'Smith Machine Bench Press',
  'EZ Bar Biceps Curl': 'EZ Bar Curl',
  'Hammer Curl (Dumbbell)': 'Hammer Curl',
  'Incline Dumbbell Press': 'Incline Dumbbell Bench Press',
  'Lateral Raise (Dumbbell)': 'Dumbbell Lateral Raise',
  'Leg Press': 'Sled Leg Press',
  'Push Up': 'Push Ups',
  'Shoulder Press (Dumbbell)': 'Dumbbell Shoulder Press',
  'Shrug (Barbell)': 'Barbell Shrug',
  'Shrug (Dumbbell)': 'Dumbbell Shrug',
  'Triceps Pushdown': 'Tricep Pushdown',
  'Incline Bench Press (Smith Machine)': 'Incline Bench Press',
  'Overhead Press (Smith Machine)': 'Shoulder Press',
  'Preacher Curl (Machine)': 'Preacher Curl',
  'Lateral Raise (Cable)': 'Cable Lateral Raise',
  'Low Cable Fly Crossovers': 'Cable Fly',
  'Pullover (Dumbbell)': 'Dumbbell Pullover',
  'Rear Delt Reverse Fly (Dumbbell)': 'Machine Reverse Fly',
  'Triceps Kickback (Dumbbell)': 'Dumbbell Tricep Kickback',
  'Triceps Extension (Dumbbell)': 'Seated Dumbbell Tricep Extension',
  'Dumbbell Tricep Extension': 'Seated Dumbbell Tricep Extension',
  'Seated Tricep Extension': 'Seated Dumbbell Tricep Extension',
}

export function mapHevyExercise(hevyTitle: string): string {
  return HEVY_EXERCISE_MAP[hevyTitle] ?? hevyTitle
}
