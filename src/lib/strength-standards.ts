// Strength standards from strengthlevel.com for a male lifter.
// Weighted exercises: 1RM thresholds in kg, keyed by lifter bodyweight (kg).
// Bodyweight exercises: thresholds in reps (body-weight-agnostic).

type Standards = { beginner: number; novice: number; intermediate: number; advanced: number; elite: number }

// [lifterBodyweightKg, Standards][] — sorted ascending by bodyweight bracket
type MultiStandards = [number, Standards][]

// Bodyweight exercises where reps are compared instead of 1RM
export const BODYWEIGHT_EXERCISES = new Set([
  'Pull Ups', 'Push Ups', 'Dips', 'Chin Ups', 'Crunches', 'Sit Ups',
  'Muscle Ups', 'Bodyweight Squat', 'One Arm Push Ups', 'Neutral Grip Pull Ups', 'Diamond Push Ups',
])

export const STRENGTH_STANDARDS: Record<string, MultiStandards> = {
  // Barbell
  'Bench Press':               [[79, { beginner: 53,  novice: 73,  intermediate: 98,  advanced: 126, elite: 156 }]],
  'Squat':                     [[79, { beginner: 71,  novice: 97,  intermediate: 129, advanced: 165, elite: 204 }]],
  'Deadlift':                  [[79, { beginner: 85,  novice: 115, intermediate: 150, advanced: 191, elite: 233 }]],
  'Shoulder Press':            [[79, { beginner: 33,  novice: 47,  intermediate: 64,  advanced: 84,  elite: 106 }]],
  'Barbell Curl':              [[79, { beginner: 20,  novice: 32,  intermediate: 48,  advanced: 67,  elite: 89  }]],
  'Bent Over Row':             [[79, { beginner: 44,  novice: 63,  intermediate: 85,  advanced: 111, elite: 139 }]],
  'Incline Bench Press':       [[79, { beginner: 49,  novice: 67,  intermediate: 88,  advanced: 112, elite: 137 }]],
  'Front Squat':               [[79, { beginner: 58,  novice: 78,  intermediate: 103, advanced: 132, elite: 162 }]],
  'Hex Bar Deadlift':          [[79, { beginner: 97,  novice: 127, intermediate: 164, advanced: 205, elite: 249 }]],
  'Hip Thrust':                [[79, { beginner: 49,  novice: 86,  intermediate: 137, advanced: 199, elite: 269 }]],
  'Romanian Deadlift':         [[79, { beginner: 61,  novice: 88,  intermediate: 121, advanced: 160, elite: 202 }]],
  'Power Clean':               [[79, { beginner: 50,  novice: 68,  intermediate: 91,  advanced: 117, elite: 145 }]],
  'Military Press':            [[79, { beginner: 34,  novice: 47,  intermediate: 63,  advanced: 82,  elite: 101 }]],
  'Sumo Deadlift':             [[79, { beginner: 98,  novice: 130, intermediate: 168, advanced: 212, elite: 258 }]],
  'Clean and Jerk':            [[79, { beginner: 47,  novice: 67,  intermediate: 92,  advanced: 121, elite: 151 }]],
  'EZ Bar Curl':               [[79, { beginner: 22,  novice: 34,  intermediate: 48,  advanced: 64,  elite: 82  }]],
  'Lying Tricep Extension':    [[79, { beginner: 18,  novice: 29,  intermediate: 44,  advanced: 62,  elite: 83  }]],
  'Close Grip Bench Press':    [[79, { beginner: 52,  novice: 69,  intermediate: 91,  advanced: 115, elite: 140 }]],
  'Snatch':                    [[79, { beginner: 37,  novice: 54,  intermediate: 75,  advanced: 101, elite: 128 }]],
  'Preacher Curl':             [[79, { beginner: 18,  novice: 30,  intermediate: 46,  advanced: 65,  elite: 87  }]],
  'Seated Shoulder Press':     [[79, { beginner: 30,  novice: 47,  intermediate: 68,  advanced: 93,  elite: 121 }]],
  'Barbell Shrug':             [[79, { beginner: 51,  novice: 85,  intermediate: 128, advanced: 181, elite: 240 }]],
  'T Bar Row':                 [[79, { beginner: 40,  novice: 61,  intermediate: 88,  advanced: 121, elite: 156 }]],
  'Clean':                     [[79, { beginner: 55,  novice: 73,  intermediate: 94,  advanced: 118, elite: 143 }]],
  'Push Press':                [[79, { beginner: 39,  novice: 57,  intermediate: 80,  advanced: 107, elite: 136 }]],
  'Smith Machine Bench Press': [[79, { beginner: 53,  novice: 73,  intermediate: 99,  advanced: 128, elite: 159 }]],
  'Decline Bench Press':       [[79, { beginner: 56,  novice: 77,  intermediate: 104, advanced: 134, elite: 166 }]],

  // Bodyweight (thresholds are in REPS — body-weight-agnostic)
  'Pull Ups':              [[0, { beginner: 0,  novice: 6,  intermediate: 13, advanced: 23, elite: 32  }]],
  'Push Ups':              [[0, { beginner: 4,  novice: 19, intermediate: 40, advanced: 64, elite: 91  }]],
  'Dips':                  [[0, { beginner: 1,  novice: 10, intermediate: 20, advanced: 32, elite: 45  }]],
  'Chin Ups':              [[0, { beginner: 0,  novice: 7,  intermediate: 14, advanced: 22, elite: 31  }]],
  'Crunches':              [[0, { beginner: 0,  novice: 21, intermediate: 55, advanced: 96, elite: 144 }]],
  'Sit Ups':               [[0, { beginner: 0,  novice: 24, intermediate: 58, advanced: 101, elite: 149 }]],
  'Muscle Ups':            [[0, { beginner: 0,  novice: 2,  intermediate: 7,  advanced: 12, elite: 17  }]],
  'Bodyweight Squat':      [[0, { beginner: 0,  novice: 17, intermediate: 57, advanced: 109, elite: 170 }]],
  'One Arm Push Ups':      [[0, { beginner: 0,  novice: 0,  intermediate: 11, advanced: 27, elite: 44  }]],
  'Neutral Grip Pull Ups': [[0, { beginner: 0,  novice: 7,  intermediate: 15, advanced: 25, elite: 36  }]],
  'Diamond Push Ups':      [[0, { beginner: 0,  novice: 10, intermediate: 24, advanced: 40, elite: 57  }]],

  // Dumbbell (weight per dumbbell in kg)
  'Dumbbell Bench Press':           [[79, { beginner: 18, novice: 28, intermediate: 42, advanced: 58, elite: 76  }]],
  'Dumbbell Curl':                  [[79, { beginner: 7,  novice: 14, intermediate: 24, advanced: 37, elite: 51  }]],
  'Incline Dumbbell Bench Press':   [[79, { beginner: 21, novice: 29, intermediate: 40, advanced: 52, elite: 65  }]],
  'Dumbbell Shoulder Press':        [[79, { beginner: 15, novice: 23, intermediate: 33, advanced: 45, elite: 58  }]],
  'Dumbbell Lateral Raise':         [[79, { beginner: 4,  novice: 9,  intermediate: 16, advanced: 25, elite: 36  }]],
  'Dumbbell Row':                   [[79, { beginner: 18, novice: 29, intermediate: 44, advanced: 61, elite: 80  }]],
  'Hammer Curl':                    [[79, { beginner: 10, novice: 16, intermediate: 24, advanced: 34, elite: 45  }]],
  'Seated Dumbbell Shoulder Press': [[79, { beginner: 14, novice: 22, intermediate: 32, advanced: 44, elite: 57  }]],
  'Dumbbell Bulgarian Split Squat': [[79, { beginner: 11, novice: 20, intermediate: 31, advanced: 45, elite: 61  }]],
  'Goblet Squat':                   [[79, { beginner: 15, novice: 27, intermediate: 44, advanced: 64, elite: 88  }]],
  'Dumbbell Fly':                   [[79, { beginner: 7,  novice: 14, intermediate: 24, advanced: 37, elite: 52  }]],
  'Dumbbell Shrug':                 [[79, { beginner: 16, novice: 29, intermediate: 47, advanced: 68, elite: 93  }]],

  // Machine
  'Sled Leg Press':         [[79, { beginner: 96,  novice: 151, intermediate: 223, advanced: 309, elite: 403 }]],
  'Leg Extension':          [[79, { beginner: 39,  novice: 65,  intermediate: 99,  advanced: 140, elite: 185 }]],
  'Horizontal Leg Press':   [[79, { beginner: 81,  novice: 131, intermediate: 196, advanced: 274, elite: 361 }]],
  'Chest Press':            [[79, { beginner: 36,  novice: 60,  intermediate: 92,  advanced: 130, elite: 172 }]],
  'Hack Squat':             [[79, { beginner: 57,  novice: 99,  intermediate: 154, advanced: 222, elite: 298 }]],
  'Machine Shoulder Press': [[79, { beginner: 28,  novice: 49,  intermediate: 77,  advanced: 112, elite: 151 }]],
  'Machine Chest Fly':      [[79, { beginner: 38,  novice: 59,  intermediate: 88,  advanced: 122, elite: 160 }]],
  'Seated Leg Curl':        [[79, { beginner: 32,  novice: 53,  intermediate: 81,  advanced: 115, elite: 152 }]],
  'Lying Leg Curl':         [[79, { beginner: 26,  novice: 43,  intermediate: 66,  advanced: 93,  elite: 124 }]],
  'Machine Calf Raise':     [[79, { beginner: 37,  novice: 78,  intermediate: 137, advanced: 213, elite: 301 }]],
  'Hip Adduction':          [[79, { beginner: 35,  novice: 67,  intermediate: 111, advanced: 166, elite: 229 }]],

  // Cable
  'Lat Pulldown':       [[79, { beginner: 42,  novice: 60,  intermediate: 83,  advanced: 110, elite: 139 }]],
  'Tricep Pushdown':    [[79, { beginner: 20,  novice: 36,  intermediate: 58,  advanced: 85,  elite: 116 }]],
  'Seated Cable Row':   [[79, { beginner: 45,  novice: 64,  intermediate: 87,  advanced: 114, elite: 143 }]],
}

function interpolateStandards(
  lowerBw: number, lower: Standards,
  upperBw: number, upper: Standards,
  targetBw: number,
): Standards {
  const t = (targetBw - lowerBw) / (upperBw - lowerBw)
  const lerp = (a: number, b: number) => Math.round(a + t * (b - a))
  return {
    beginner:     lerp(lower.beginner,     upper.beginner),
    novice:       lerp(lower.novice,       upper.novice),
    intermediate: lerp(lower.intermediate, upper.intermediate),
    advanced:     lerp(lower.advanced,     upper.advanced),
    elite:        lerp(lower.elite,        upper.elite),
  }
}

function lookupStandards(multi: MultiStandards, bodyweightKg: number): Standards {
  if (multi.length === 1) return multi[0][1]
  if (bodyweightKg <= multi[0][0]) return multi[0][1]
  if (bodyweightKg >= multi[multi.length - 1][0]) return multi[multi.length - 1][1]
  for (let i = 0; i < multi.length - 1; i++) {
    const [lowerBw, lower] = multi[i]
    const [upperBw, upper] = multi[i + 1]
    if (bodyweightKg <= upperBw) {
      return interpolateStandards(lowerBw, lower, upperBw, upper, bodyweightKg)
    }
  }
  return multi[multi.length - 1][1]
}

// Epley formula for estimated 1RM
function oneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

export type StrengthLevel = 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Elite'

// Tailwind classes for badge UI
export const strengthLevelBadge: Record<StrengthLevel, string> = {
  Beginner:     'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Novice:       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
  Advanced:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite:        'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

// Hex fill colors for SVG/canvas use
export const strengthLevelColor: Record<StrengthLevel, string> = {
  Beginner:     '#94a3b8',
  Novice:       '#60a5fa',
  Intermediate: '#4ade80',
  Advanced:     '#fb923c',
  Elite:        '#c084fc',
}

export function getStrengthLevel(
  exercise: string,
  userBodyweightKg: number,
  setWeightKg: number,
  reps: number,
): StrengthLevel {
  const multi = STRENGTH_STANDARDS[exercise]
  if (!multi) return 'Intermediate'

  const standards = lookupStandards(multi, userBodyweightKg)
  const isBodyweight = BODYWEIGHT_EXERCISES.has(exercise) && setWeightKg === 0
  const value = isBodyweight ? reps : oneRepMax(setWeightKg, reps)

  if (value >= standards.elite) return 'Elite'
  if (value >= standards.advanced) return 'Advanced'
  if (value >= standards.intermediate) return 'Intermediate'
  if (value >= standards.novice) return 'Novice'
  return 'Beginner'
}
