// Strength standards from strengthlevel.com for a male lifter.
// Weighted exercises: 1RM thresholds in kg, keyed by lifter bodyweight (kg).
// Bodyweight exercises: thresholds in reps (body-weight-agnostic).

type Standards = {
  beginner: number
  novice: number
  intermediate: number
  advanced: number
  elite: number
}

// [lifterBodyweightKg, Standards][] — sorted ascending by bodyweight bracket
type MultiStandards = [number, Standards][]

// Bodyweight exercises where reps are compared instead of 1RM
export const BODYWEIGHT_EXERCISES = new Set([
  'Pull Ups',
  'Push Ups',
  'Dips',
  'Chin Ups',
  'Crunches',
  'Sit Ups',
  'Muscle Ups',
  'Bodyweight Squat',
  'One Arm Push Ups',
  'Neutral Grip Pull Ups',
  'Diamond Push Ups',
])

export const STRENGTH_STANDARDS: Record<string, MultiStandards> = {
  // Barbell
  'Bench Press': [
    [
      79,
      { beginner: 53, novice: 73, intermediate: 98, advanced: 126, elite: 156 },
    ],
  ],
  Squat: [
    [
      79,
      {
        beginner: 71,
        novice: 97,
        intermediate: 129,
        advanced: 165,
        elite: 204,
      },
    ],
  ],
  Deadlift: [
    [
      79,
      {
        beginner: 85,
        novice: 115,
        intermediate: 150,
        advanced: 191,
        elite: 233,
      },
    ],
  ],
  'Shoulder Press': [
    [
      79,
      { beginner: 33, novice: 47, intermediate: 64, advanced: 84, elite: 106 },
    ],
  ],
  'Barbell Curl': [
    [
      79,
      { beginner: 20, novice: 32, intermediate: 48, advanced: 67, elite: 89 },
    ],
  ],
  'Bent Over Row': [
    [
      79,
      { beginner: 44, novice: 63, intermediate: 85, advanced: 111, elite: 139 },
    ],
  ],
  'Incline Bench Press': [
    [
      79,
      { beginner: 49, novice: 67, intermediate: 88, advanced: 112, elite: 137 },
    ],
  ],
  'Front Squat': [
    [
      79,
      {
        beginner: 58,
        novice: 78,
        intermediate: 103,
        advanced: 132,
        elite: 162,
      },
    ],
  ],
  'Hex Bar Deadlift': [
    [
      79,
      {
        beginner: 97,
        novice: 127,
        intermediate: 164,
        advanced: 205,
        elite: 249,
      },
    ],
  ],
  'Hip Thrust': [
    [
      79,
      {
        beginner: 49,
        novice: 86,
        intermediate: 137,
        advanced: 199,
        elite: 269,
      },
    ],
  ],
  'Romanian Deadlift': [
    [
      79,
      {
        beginner: 61,
        novice: 88,
        intermediate: 121,
        advanced: 160,
        elite: 202,
      },
    ],
  ],
  'Power Clean': [
    [
      79,
      { beginner: 50, novice: 68, intermediate: 91, advanced: 117, elite: 145 },
    ],
  ],
  'Military Press': [
    [
      79,
      { beginner: 34, novice: 47, intermediate: 63, advanced: 82, elite: 101 },
    ],
  ],
  'Rack Pull': [
    [
      50,
      {
        beginner: 51,
        novice: 80,
        intermediate: 119,
        advanced: 165,
        elite: 216,
      },
    ],
    [
      55,
      {
        beginner: 59,
        novice: 91,
        intermediate: 131,
        advanced: 179,
        elite: 232,
      },
    ],
    [
      60,
      {
        beginner: 67,
        novice: 100,
        intermediate: 143,
        advanced: 193,
        elite: 247,
      },
    ],
    [
      65,
      {
        beginner: 74,
        novice: 110,
        intermediate: 154,
        advanced: 206,
        elite: 262,
      },
    ],
    [
      70,
      {
        beginner: 82,
        novice: 119,
        intermediate: 165,
        advanced: 218,
        elite: 276,
      },
    ],
    [
      75,
      {
        beginner: 89,
        novice: 128,
        intermediate: 175,
        advanced: 230,
        elite: 289,
      },
    ],
    [
      80,
      {
        beginner: 96,
        novice: 136,
        intermediate: 185,
        advanced: 241,
        elite: 302,
      },
    ],
    [
      85,
      {
        beginner: 103,
        novice: 144,
        intermediate: 195,
        advanced: 252,
        elite: 314,
      },
    ],
    [
      90,
      {
        beginner: 110,
        novice: 152,
        intermediate: 204,
        advanced: 263,
        elite: 326,
      },
    ],
    [
      95,
      {
        beginner: 117,
        novice: 160,
        intermediate: 213,
        advanced: 273,
        elite: 337,
      },
    ],
    [
      100,
      {
        beginner: 123,
        novice: 168,
        intermediate: 221,
        advanced: 283,
        elite: 348,
      },
    ],
    [
      105,
      {
        beginner: 130,
        novice: 175,
        intermediate: 230,
        advanced: 292,
        elite: 359,
      },
    ],
    [
      110,
      {
        beginner: 136,
        novice: 182,
        intermediate: 238,
        advanced: 302,
        elite: 369,
      },
    ],
    [
      115,
      {
        beginner: 142,
        novice: 189,
        intermediate: 246,
        advanced: 310,
        elite: 379,
      },
    ],
    [
      120,
      {
        beginner: 148,
        novice: 196,
        intermediate: 254,
        advanced: 319,
        elite: 388,
      },
    ],
    [
      125,
      {
        beginner: 153,
        novice: 202,
        intermediate: 261,
        advanced: 328,
        elite: 398,
      },
    ],
    [
      130,
      {
        beginner: 159,
        novice: 209,
        intermediate: 269,
        advanced: 336,
        elite: 407,
      },
    ],
    [
      135,
      {
        beginner: 164,
        novice: 215,
        intermediate: 276,
        advanced: 344,
        elite: 416,
      },
    ],
    [
      140,
      {
        beginner: 170,
        novice: 221,
        intermediate: 283,
        advanced: 352,
        elite: 424,
      },
    ],
  ],
  'Sumo Deadlift': [
    [
      79,
      {
        beginner: 98,
        novice: 130,
        intermediate: 168,
        advanced: 212,
        elite: 258,
      },
    ],
  ],
  'Clean and Jerk': [
    [
      79,
      { beginner: 47, novice: 67, intermediate: 92, advanced: 121, elite: 151 },
    ],
  ],
  'EZ Bar Curl': [
    [
      79,
      { beginner: 22, novice: 34, intermediate: 48, advanced: 64, elite: 82 },
    ],
  ],
  'Close Grip Bench Press': [
    [
      79,
      { beginner: 52, novice: 69, intermediate: 91, advanced: 115, elite: 140 },
    ],
  ],
  Snatch: [
    [
      79,
      { beginner: 37, novice: 54, intermediate: 75, advanced: 101, elite: 128 },
    ],
  ],
  'Preacher Curl': [
    [
      79,
      { beginner: 18, novice: 30, intermediate: 46, advanced: 65, elite: 87 },
    ],
  ],
  'Barbell Shrug': [
    [
      79,
      {
        beginner: 51,
        novice: 85,
        intermediate: 128,
        advanced: 181,
        elite: 240,
      },
    ],
  ],
  'T Bar Row': [
    [
      79,
      { beginner: 40, novice: 61, intermediate: 88, advanced: 121, elite: 156 },
    ],
  ],
  Clean: [
    [
      79,
      { beginner: 55, novice: 73, intermediate: 94, advanced: 118, elite: 143 },
    ],
  ],
  'Push Press': [
    [
      79,
      { beginner: 39, novice: 57, intermediate: 80, advanced: 107, elite: 136 },
    ],
  ],
  'Decline Bench Press': [
    [
      79,
      {
        beginner: 56,
        novice: 77,
        intermediate: 104,
        advanced: 134,
        elite: 166,
      },
    ],
  ],

  // Bodyweight (thresholds are in REPS — body-weight-agnostic)
  'Pull Ups': [
    [0, { beginner: 0, novice: 6, intermediate: 13, advanced: 23, elite: 32 }],
  ],
  'Push Ups': [
    [0, { beginner: 4, novice: 19, intermediate: 40, advanced: 64, elite: 91 }],
  ],
  Dips: [
    [0, { beginner: 1, novice: 10, intermediate: 20, advanced: 32, elite: 45 }],
  ],
  'Chin Ups': [
    [0, { beginner: 0, novice: 7, intermediate: 14, advanced: 22, elite: 31 }],
  ],
  Crunches: [
    [
      0,
      { beginner: 0, novice: 21, intermediate: 55, advanced: 96, elite: 144 },
    ],
  ],
  'Sit Ups': [
    [
      0,
      { beginner: 0, novice: 24, intermediate: 58, advanced: 101, elite: 149 },
    ],
  ],
  'Muscle Ups': [
    [0, { beginner: 0, novice: 2, intermediate: 7, advanced: 12, elite: 17 }],
  ],
  'Bodyweight Squat': [
    [
      0,
      { beginner: 0, novice: 17, intermediate: 57, advanced: 109, elite: 170 },
    ],
  ],
  'One Arm Push Ups': [
    [0, { beginner: 0, novice: 0, intermediate: 11, advanced: 27, elite: 44 }],
  ],
  'Neutral Grip Pull Ups': [
    [0, { beginner: 0, novice: 7, intermediate: 15, advanced: 25, elite: 36 }],
  ],
  'Diamond Push Ups': [
    [0, { beginner: 0, novice: 10, intermediate: 24, advanced: 40, elite: 57 }],
  ],

  // Dumbbell (weight per dumbbell in kg)
  'Lying Tricep Extension': [
    [
      79,
      { beginner: 18, novice: 29, intermediate: 44, advanced: 62, elite: 83 },
    ],
  ],
  'Concentration Curl': [
    [50, { beginner: 3, novice: 8, intermediate: 15, advanced: 24, elite: 34 }],
    [55, { beginner: 4, novice: 9, intermediate: 16, advanced: 26, elite: 36 }],
    [
      60,
      { beginner: 5, novice: 10, intermediate: 18, advanced: 27, elite: 38 },
    ],
    [
      65,
      { beginner: 6, novice: 11, intermediate: 19, advanced: 29, elite: 40 },
    ],
    [
      70,
      { beginner: 6, novice: 12, intermediate: 20, advanced: 31, elite: 42 },
    ],
    [
      75,
      { beginner: 7, novice: 13, intermediate: 21, advanced: 32, elite: 44 },
    ],
    [
      80,
      { beginner: 8, novice: 14, intermediate: 23, advanced: 33, elite: 46 },
    ],
    [
      85,
      { beginner: 8, novice: 15, intermediate: 24, advanced: 35, elite: 47 },
    ],
    [
      90,
      { beginner: 9, novice: 16, intermediate: 25, advanced: 36, elite: 49 },
    ],
    [
      95,
      { beginner: 10, novice: 16, intermediate: 26, advanced: 37, elite: 50 },
    ],
    [
      100,
      { beginner: 10, novice: 17, intermediate: 27, advanced: 39, elite: 52 },
    ],
    [
      105,
      { beginner: 11, novice: 18, intermediate: 28, advanced: 40, elite: 53 },
    ],
    [
      110,
      { beginner: 11, novice: 19, intermediate: 29, advanced: 41, elite: 54 },
    ],
    [
      115,
      { beginner: 12, novice: 20, intermediate: 30, advanced: 42, elite: 56 },
    ],
    [
      120,
      { beginner: 12, novice: 20, intermediate: 31, advanced: 43, elite: 57 },
    ],
    [
      125,
      { beginner: 13, novice: 21, intermediate: 31, advanced: 44, elite: 58 },
    ],
    [
      130,
      { beginner: 14, novice: 22, intermediate: 32, advanced: 45, elite: 59 },
    ],
    [
      135,
      { beginner: 14, novice: 22, intermediate: 33, advanced: 46, elite: 60 },
    ],
    [
      140,
      { beginner: 15, novice: 23, intermediate: 34, advanced: 47, elite: 61 },
    ],
  ],
  'Dumbbell Pullover': [
    [
      50,
      { beginner: 5, novice: 12, intermediate: 21, advanced: 33, elite: 47 },
    ],
    [
      55,
      { beginner: 7, novice: 14, intermediate: 24, advanced: 36, elite: 51 },
    ],
    [
      60,
      { beginner: 8, novice: 16, intermediate: 26, advanced: 39, elite: 55 },
    ],
    [
      65,
      { beginner: 10, novice: 18, intermediate: 29, advanced: 43, elite: 58 },
    ],
    [
      70,
      { beginner: 11, novice: 20, intermediate: 31, advanced: 45, elite: 62 },
    ],
    [
      75,
      { beginner: 12, novice: 21, intermediate: 34, advanced: 48, elite: 65 },
    ],
    [
      80,
      { beginner: 14, novice: 23, intermediate: 36, advanced: 51, elite: 68 },
    ],
    [
      85,
      { beginner: 15, novice: 25, intermediate: 38, advanced: 54, elite: 71 },
    ],
    [
      90,
      { beginner: 17, novice: 27, intermediate: 40, advanced: 56, elite: 74 },
    ],
    [
      95,
      { beginner: 18, novice: 29, intermediate: 42, advanced: 59, elite: 77 },
    ],
    [
      100,
      { beginner: 19, novice: 30, intermediate: 44, advanced: 61, elite: 80 },
    ],
    [
      105,
      { beginner: 21, novice: 32, intermediate: 46, advanced: 64, elite: 82 },
    ],
    [
      110,
      { beginner: 22, novice: 34, intermediate: 48, advanced: 66, elite: 85 },
    ],
    [
      115,
      { beginner: 23, novice: 35, intermediate: 50, advanced: 68, elite: 87 },
    ],
    [
      120,
      { beginner: 24, novice: 37, intermediate: 52, advanced: 70, elite: 90 },
    ],
    [
      125,
      { beginner: 26, novice: 38, intermediate: 54, advanced: 72, elite: 92 },
    ],
    [
      130,
      { beginner: 27, novice: 40, intermediate: 56, advanced: 74, elite: 95 },
    ],
    [
      135,
      { beginner: 28, novice: 41, intermediate: 57, advanced: 76, elite: 97 },
    ],
    [
      140,
      { beginner: 29, novice: 42, intermediate: 59, advanced: 78, elite: 99 },
    ],
  ],
  'Dumbbell Bench Press': [
    [
      79,
      { beginner: 18, novice: 28, intermediate: 42, advanced: 58, elite: 76 },
    ],
  ],
  'Dumbbell Curl': [
    [
      79,
      { beginner: 7, novice: 14, intermediate: 24, advanced: 37, elite: 51 },
    ],
  ],
  'Incline Dumbbell Bench Press': [
    [
      79,
      { beginner: 21, novice: 29, intermediate: 40, advanced: 52, elite: 65 },
    ],
  ],
  'Dumbbell Shoulder Press': [
    [
      79,
      { beginner: 15, novice: 23, intermediate: 33, advanced: 45, elite: 58 },
    ],
  ],
  'Dumbbell Lateral Raise': [
    [79, { beginner: 4, novice: 9, intermediate: 16, advanced: 25, elite: 36 }],
  ],
  'Dumbbell Row': [
    [
      79,
      { beginner: 18, novice: 29, intermediate: 44, advanced: 61, elite: 80 },
    ],
  ],
  'Hammer Curl': [
    [
      79,
      { beginner: 10, novice: 16, intermediate: 24, advanced: 34, elite: 45 },
    ],
  ],
  'Seated Dumbbell Shoulder Press': [
    [
      79,
      { beginner: 14, novice: 22, intermediate: 32, advanced: 44, elite: 57 },
    ],
  ],
  'Dumbbell Bulgarian Split Squat': [
    [
      79,
      { beginner: 11, novice: 20, intermediate: 31, advanced: 45, elite: 61 },
    ],
  ],
  'Goblet Squat': [
    [
      79,
      { beginner: 15, novice: 27, intermediate: 44, advanced: 64, elite: 88 },
    ],
  ],
  'Seated Dumbbell Tricep Extension': [
    [50, { beginner: 2, novice: 6, intermediate: 14, advanced: 25, elite: 38 }],
    [55, { beginner: 2, novice: 7, intermediate: 16, advanced: 27, elite: 41 }],
    [60, { beginner: 3, novice: 9, intermediate: 18, advanced: 30, elite: 44 }],
    [
      65,
      { beginner: 4, novice: 10, intermediate: 19, advanced: 32, elite: 47 },
    ],
    [
      70,
      { beginner: 4, novice: 11, intermediate: 21, advanced: 34, elite: 50 },
    ],
    [
      75,
      { beginner: 5, novice: 12, intermediate: 23, advanced: 37, elite: 53 },
    ],
    [
      80,
      { beginner: 6, novice: 14, intermediate: 24, advanced: 39, elite: 55 },
    ],
    [
      85,
      { beginner: 7, novice: 15, intermediate: 26, advanced: 41, elite: 58 },
    ],
    [
      90,
      { beginner: 8, novice: 16, intermediate: 28, advanced: 43, elite: 60 },
    ],
    [
      95,
      { beginner: 9, novice: 17, intermediate: 29, advanced: 44, elite: 62 },
    ],
    [
      100,
      { beginner: 9, novice: 18, intermediate: 31, advanced: 46, elite: 64 },
    ],
    [
      105,
      { beginner: 10, novice: 19, intermediate: 32, advanced: 48, elite: 66 },
    ],
    [
      110,
      { beginner: 11, novice: 20, intermediate: 33, advanced: 50, elite: 68 },
    ],
    [
      115,
      { beginner: 12, novice: 21, intermediate: 35, advanced: 51, elite: 70 },
    ],
    [
      120,
      { beginner: 13, novice: 23, intermediate: 36, advanced: 53, elite: 72 },
    ],
    [
      125,
      { beginner: 13, novice: 24, intermediate: 38, advanced: 55, elite: 74 },
    ],
    [
      130,
      { beginner: 14, novice: 25, intermediate: 39, advanced: 56, elite: 76 },
    ],
    [
      135,
      { beginner: 15, novice: 26, intermediate: 40, advanced: 58, elite: 78 },
    ],
    [
      140,
      { beginner: 16, novice: 27, intermediate: 41, advanced: 59, elite: 79 },
    ],
  ],
  'Dumbbell Tricep Kickback': [
    [50, { beginner: 1, novice: 5, intermediate: 12, advanced: 20, elite: 31 }],
    [55, { beginner: 2, novice: 6, intermediate: 13, advanced: 22, elite: 33 }],
    [60, { beginner: 3, novice: 7, intermediate: 14, advanced: 24, elite: 35 }],
    [65, { beginner: 3, novice: 8, intermediate: 15, advanced: 25, elite: 37 }],
    [70, { beginner: 4, novice: 9, intermediate: 17, advanced: 27, elite: 39 }],
    [
      75,
      { beginner: 4, novice: 10, intermediate: 18, advanced: 29, elite: 41 },
    ],
    [
      80,
      { beginner: 5, novice: 11, intermediate: 19, advanced: 30, elite: 43 },
    ],
    [
      85,
      { beginner: 5, novice: 11, intermediate: 20, advanced: 31, elite: 44 },
    ],
    [
      90,
      { beginner: 6, novice: 12, intermediate: 21, advanced: 33, elite: 46 },
    ],
    [
      95,
      { beginner: 7, novice: 13, intermediate: 22, advanced: 34, elite: 48 },
    ],
    [
      100,
      { beginner: 7, novice: 14, intermediate: 23, advanced: 35, elite: 49 },
    ],
    [
      105,
      { beginner: 8, novice: 15, intermediate: 24, advanced: 37, elite: 50 },
    ],
    [
      110,
      { beginner: 8, novice: 15, intermediate: 25, advanced: 38, elite: 52 },
    ],
    [
      115,
      { beginner: 9, novice: 16, intermediate: 26, advanced: 39, elite: 53 },
    ],
    [
      120,
      { beginner: 9, novice: 17, intermediate: 27, advanced: 40, elite: 54 },
    ],
    [
      125,
      { beginner: 10, novice: 18, intermediate: 28, advanced: 41, elite: 56 },
    ],
    [
      130,
      { beginner: 10, novice: 18, intermediate: 29, advanced: 42, elite: 57 },
    ],
    [
      135,
      { beginner: 11, novice: 19, intermediate: 30, advanced: 43, elite: 58 },
    ],
    [
      140,
      { beginner: 11, novice: 20, intermediate: 31, advanced: 44, elite: 59 },
    ],
  ],
  'Dumbbell Fly': [
    [
      79,
      { beginner: 7, novice: 14, intermediate: 24, advanced: 37, elite: 52 },
    ],
  ],
  'Dumbbell Shrug': [
    [
      79,
      { beginner: 16, novice: 29, intermediate: 47, advanced: 68, elite: 93 },
    ],
  ],

  // Machine
  'Smith Machine Bench Press': [
    [
      79,
      { beginner: 53, novice: 73, intermediate: 99, advanced: 128, elite: 159 },
    ],
  ],
  'Seated Shoulder Press': [
    [
      79,
      { beginner: 30, novice: 47, intermediate: 68, advanced: 93, elite: 121 },
    ],
  ],
  'Sled Leg Press': [
    [
      79,
      {
        beginner: 96,
        novice: 151,
        intermediate: 223,
        advanced: 309,
        elite: 403,
      },
    ],
  ],
  'Leg Extension': [
    [
      79,
      { beginner: 39, novice: 65, intermediate: 99, advanced: 140, elite: 185 },
    ],
  ],
  'Horizontal Leg Press': [
    [
      79,
      {
        beginner: 81,
        novice: 131,
        intermediate: 196,
        advanced: 274,
        elite: 361,
      },
    ],
  ],
  'Chest Press': [
    [
      79,
      { beginner: 36, novice: 60, intermediate: 92, advanced: 130, elite: 172 },
    ],
  ],
  'Hack Squat': [
    [
      79,
      {
        beginner: 57,
        novice: 99,
        intermediate: 154,
        advanced: 222,
        elite: 298,
      },
    ],
  ],
  'Machine Shoulder Press': [
    [
      79,
      { beginner: 28, novice: 49, intermediate: 77, advanced: 112, elite: 151 },
    ],
  ],
  'Machine Reverse Fly': [
    [
      50,
      { beginner: 11, novice: 23, intermediate: 40, advanced: 61, elite: 87 },
    ],
    [
      55,
      { beginner: 13, novice: 26, intermediate: 45, advanced: 67, elite: 94 },
    ],
    [
      60,
      { beginner: 16, novice: 30, intermediate: 49, advanced: 73, elite: 100 },
    ],
    [
      65,
      { beginner: 19, novice: 33, intermediate: 54, advanced: 79, elite: 107 },
    ],
    [
      70,
      { beginner: 21, novice: 37, intermediate: 58, advanced: 84, elite: 113 },
    ],
    [
      75,
      { beginner: 24, novice: 40, intermediate: 62, advanced: 89, elite: 119 },
    ],
    [
      80,
      { beginner: 26, novice: 43, intermediate: 66, advanced: 94, elite: 124 },
    ],
    [
      85,
      { beginner: 29, novice: 47, intermediate: 70, advanced: 98, elite: 129 },
    ],
    [
      90,
      { beginner: 31, novice: 50, intermediate: 74, advanced: 103, elite: 135 },
    ],
    [
      95,
      { beginner: 34, novice: 53, intermediate: 78, advanced: 107, elite: 140 },
    ],
    [
      100,
      { beginner: 36, novice: 56, intermediate: 81, advanced: 111, elite: 144 },
    ],
    [
      105,
      { beginner: 38, novice: 59, intermediate: 85, advanced: 115, elite: 149 },
    ],
    [
      110,
      { beginner: 41, novice: 61, intermediate: 88, advanced: 119, elite: 153 },
    ],
    [
      115,
      { beginner: 43, novice: 64, intermediate: 91, advanced: 123, elite: 158 },
    ],
    [
      120,
      { beginner: 45, novice: 67, intermediate: 94, advanced: 127, elite: 162 },
    ],
    [
      125,
      { beginner: 47, novice: 69, intermediate: 98, advanced: 130, elite: 166 },
    ],
    [
      130,
      {
        beginner: 49,
        novice: 72,
        intermediate: 101,
        advanced: 134,
        elite: 170,
      },
    ],
    [
      135,
      {
        beginner: 51,
        novice: 75,
        intermediate: 104,
        advanced: 137,
        elite: 174,
      },
    ],
    [
      140,
      {
        beginner: 53,
        novice: 77,
        intermediate: 106,
        advanced: 141,
        elite: 178,
      },
    ],
  ],
  'Machine Chest Fly': [
    [
      79,
      { beginner: 38, novice: 59, intermediate: 88, advanced: 122, elite: 160 },
    ],
  ],
  'Seated Leg Curl': [
    [
      79,
      { beginner: 32, novice: 53, intermediate: 81, advanced: 115, elite: 152 },
    ],
  ],
  'Lying Leg Curl': [
    [
      79,
      { beginner: 26, novice: 43, intermediate: 66, advanced: 93, elite: 124 },
    ],
  ],
  'Sled Press Calf Raise': [
    [
      50,
      { beginner: 9, novice: 38, intermediate: 91, advanced: 166, elite: 259 },
    ],
    [
      55,
      {
        beginner: 15,
        novice: 51,
        intermediate: 111,
        advanced: 193,
        elite: 292,
      },
    ],
    [
      60,
      {
        beginner: 23,
        novice: 65,
        intermediate: 130,
        advanced: 219,
        elite: 324,
      },
    ],
    [
      65,
      {
        beginner: 32,
        novice: 79,
        intermediate: 150,
        advanced: 244,
        elite: 355,
      },
    ],
    [
      70,
      {
        beginner: 41,
        novice: 93,
        intermediate: 170,
        advanced: 269,
        elite: 385,
      },
    ],
    [
      75,
      {
        beginner: 51,
        novice: 108,
        intermediate: 189,
        advanced: 293,
        elite: 413,
      },
    ],
    [
      80,
      {
        beginner: 61,
        novice: 122,
        intermediate: 208,
        advanced: 316,
        elite: 441,
      },
    ],
    [
      85,
      {
        beginner: 72,
        novice: 136,
        intermediate: 226,
        advanced: 339,
        elite: 468,
      },
    ],
    [
      90,
      {
        beginner: 82,
        novice: 151,
        intermediate: 245,
        advanced: 362,
        elite: 494,
      },
    ],
    [
      95,
      {
        beginner: 93,
        novice: 165,
        intermediate: 263,
        advanced: 383,
        elite: 520,
      },
    ],
    [
      100,
      {
        beginner: 103,
        novice: 179,
        intermediate: 280,
        advanced: 405,
        elite: 544,
      },
    ],
    [
      105,
      {
        beginner: 114,
        novice: 193,
        intermediate: 298,
        advanced: 425,
        elite: 568,
      },
    ],
    [
      110,
      {
        beginner: 124,
        novice: 206,
        intermediate: 315,
        advanced: 445,
        elite: 592,
      },
    ],
    [
      115,
      {
        beginner: 135,
        novice: 220,
        intermediate: 331,
        advanced: 465,
        elite: 614,
      },
    ],
    [
      120,
      {
        beginner: 145,
        novice: 233,
        intermediate: 348,
        advanced: 485,
        elite: 636,
      },
    ],
    [
      125,
      {
        beginner: 156,
        novice: 246,
        intermediate: 364,
        advanced: 503,
        elite: 658,
      },
    ],
    [
      130,
      {
        beginner: 166,
        novice: 259,
        intermediate: 379,
        advanced: 522,
        elite: 679,
      },
    ],
    [
      135,
      {
        beginner: 176,
        novice: 272,
        intermediate: 395,
        advanced: 540,
        elite: 700,
      },
    ],
    [
      140,
      {
        beginner: 187,
        novice: 285,
        intermediate: 410,
        advanced: 558,
        elite: 720,
      },
    ],
  ],
  'Machine Calf Raise': [
    [
      79,
      {
        beginner: 37,
        novice: 78,
        intermediate: 137,
        advanced: 213,
        elite: 301,
      },
    ],
  ],
  'Hip Adduction': [
    [
      79,
      {
        beginner: 35,
        novice: 67,
        intermediate: 111,
        advanced: 166,
        elite: 229,
      },
    ],
  ],

  // Cable
  'Cable Fly': [
    [50, { beginner: 1, novice: 7, intermediate: 21, advanced: 42, elite: 69 }],
    [55, { beginner: 1, novice: 9, intermediate: 24, advanced: 47, elite: 75 }],
    [
      60,
      { beginner: 2, novice: 11, intermediate: 28, advanced: 52, elite: 81 },
    ],
    [
      65,
      { beginner: 3, novice: 13, intermediate: 31, advanced: 56, elite: 87 },
    ],
    [
      70,
      { beginner: 4, novice: 15, intermediate: 34, advanced: 60, elite: 92 },
    ],
    [
      75,
      { beginner: 5, novice: 17, intermediate: 37, advanced: 64, elite: 97 },
    ],
    [
      80,
      { beginner: 7, novice: 19, intermediate: 40, advanced: 68, elite: 102 },
    ],
    [
      85,
      { beginner: 8, novice: 22, intermediate: 43, advanced: 72, elite: 106 },
    ],
    [
      90,
      { beginner: 9, novice: 24, intermediate: 46, advanced: 76, elite: 111 },
    ],
    [
      95,
      { beginner: 10, novice: 26, intermediate: 49, advanced: 79, elite: 115 },
    ],
    [
      100,
      { beginner: 12, novice: 28, intermediate: 51, advanced: 83, elite: 119 },
    ],
    [
      105,
      { beginner: 13, novice: 30, intermediate: 54, advanced: 86, elite: 123 },
    ],
    [
      110,
      { beginner: 14, novice: 31, intermediate: 57, advanced: 89, elite: 127 },
    ],
    [
      115,
      { beginner: 16, novice: 33, intermediate: 59, advanced: 93, elite: 131 },
    ],
    [
      120,
      { beginner: 17, novice: 35, intermediate: 62, advanced: 96, elite: 135 },
    ],
    [
      125,
      { beginner: 18, novice: 37, intermediate: 64, advanced: 99, elite: 138 },
    ],
    [
      130,
      { beginner: 19, novice: 39, intermediate: 67, advanced: 102, elite: 142 },
    ],
    [
      135,
      { beginner: 21, novice: 41, intermediate: 69, advanced: 104, elite: 145 },
    ],
    [
      140,
      { beginner: 22, novice: 42, intermediate: 71, advanced: 107, elite: 149 },
    ],
  ],
  'Cable Lateral Raise': [
    [50, { beginner: 0, novice: 3, intermediate: 11, advanced: 24, elite: 42 }],
    [55, { beginner: 0, novice: 3, intermediate: 12, advanced: 27, elite: 45 }],
    [60, { beginner: 0, novice: 4, intermediate: 14, advanced: 29, elite: 48 }],
    [65, { beginner: 0, novice: 5, intermediate: 15, advanced: 31, elite: 51 }],
    [70, { beginner: 1, novice: 6, intermediate: 16, advanced: 33, elite: 53 }],
    [75, { beginner: 1, novice: 7, intermediate: 18, advanced: 34, elite: 56 }],
    [80, { beginner: 1, novice: 7, intermediate: 19, advanced: 36, elite: 58 }],
    [85, { beginner: 2, novice: 8, intermediate: 20, advanced: 38, elite: 60 }],
    [90, { beginner: 2, novice: 9, intermediate: 21, advanced: 40, elite: 62 }],
    [
      95,
      { beginner: 2, novice: 10, intermediate: 23, advanced: 41, elite: 64 },
    ],
    [
      100,
      { beginner: 3, novice: 10, intermediate: 24, advanced: 43, elite: 66 },
    ],
    [
      105,
      { beginner: 3, novice: 11, intermediate: 25, advanced: 44, elite: 68 },
    ],
    [
      110,
      { beginner: 3, novice: 12, intermediate: 26, advanced: 46, elite: 70 },
    ],
    [
      115,
      { beginner: 4, novice: 13, intermediate: 27, advanced: 47, elite: 71 },
    ],
    [
      120,
      { beginner: 4, novice: 13, intermediate: 28, advanced: 48, elite: 73 },
    ],
    [
      125,
      { beginner: 5, novice: 14, intermediate: 29, advanced: 50, elite: 75 },
    ],
    [
      130,
      { beginner: 5, novice: 15, intermediate: 30, advanced: 51, elite: 76 },
    ],
    [
      135,
      { beginner: 5, novice: 15, intermediate: 31, advanced: 52, elite: 78 },
    ],
    [
      140,
      { beginner: 6, novice: 16, intermediate: 32, advanced: 54, elite: 79 },
    ],
  ],
  'Cable Crunch': [
    [
      50,
      { beginner: 7, novice: 23, intermediate: 49, advanced: 85, elite: 128 },
    ],
    [
      55,
      { beginner: 9, novice: 27, intermediate: 54, advanced: 92, elite: 137 },
    ],
    [
      60,
      { beginner: 12, novice: 30, intermediate: 60, advanced: 99, elite: 145 },
    ],
    [
      65,
      { beginner: 14, novice: 34, intermediate: 65, advanced: 105, elite: 153 },
    ],
    [
      70,
      { beginner: 16, novice: 38, intermediate: 70, advanced: 112, elite: 161 },
    ],
    [
      75,
      { beginner: 19, novice: 41, intermediate: 75, advanced: 118, elite: 168 },
    ],
    [
      80,
      { beginner: 21, novice: 45, intermediate: 79, advanced: 124, elite: 175 },
    ],
    [
      85,
      { beginner: 23, novice: 48, intermediate: 84, advanced: 129, elite: 182 },
    ],
    [
      90,
      { beginner: 26, novice: 52, intermediate: 88, advanced: 135, elite: 188 },
    ],
    [
      95,
      { beginner: 28, novice: 55, intermediate: 92, advanced: 140, elite: 194 },
    ],
    [
      100,
      { beginner: 30, novice: 58, intermediate: 96, advanced: 145, elite: 200 },
    ],
    [
      105,
      {
        beginner: 32,
        novice: 61,
        intermediate: 100,
        advanced: 150,
        elite: 206,
      },
    ],
    [
      110,
      {
        beginner: 35,
        novice: 64,
        intermediate: 104,
        advanced: 154,
        elite: 211,
      },
    ],
    [
      115,
      {
        beginner: 37,
        novice: 67,
        intermediate: 108,
        advanced: 159,
        elite: 216,
      },
    ],
    [
      120,
      {
        beginner: 39,
        novice: 70,
        intermediate: 112,
        advanced: 163,
        elite: 222,
      },
    ],
    [
      125,
      {
        beginner: 41,
        novice: 73,
        intermediate: 115,
        advanced: 168,
        elite: 227,
      },
    ],
    [
      130,
      {
        beginner: 43,
        novice: 75,
        intermediate: 119,
        advanced: 172,
        elite: 231,
      },
    ],
    [
      135,
      {
        beginner: 45,
        novice: 78,
        intermediate: 122,
        advanced: 176,
        elite: 236,
      },
    ],
    [
      140,
      {
        beginner: 47,
        novice: 81,
        intermediate: 125,
        advanced: 180,
        elite: 241,
      },
    ],
  ],
  'Lat Pulldown': [
    [
      79,
      { beginner: 42, novice: 60, intermediate: 83, advanced: 110, elite: 139 },
    ],
  ],
  'Tricep Pushdown': [
    [
      79,
      { beginner: 20, novice: 36, intermediate: 58, advanced: 85, elite: 116 },
    ],
  ],
  'Face Pull': [
    [
      50,
      { beginner: 5, novice: 14, intermediate: 28, advanced: 48, elite: 71 },
    ],
    [
      55,
      { beginner: 6, novice: 16, intermediate: 32, advanced: 52, elite: 77 },
    ],
    [
      60,
      { beginner: 8, novice: 19, intermediate: 35, advanced: 56, elite: 82 },
    ],
    [
      65,
      { beginner: 9, novice: 21, intermediate: 38, advanced: 61, elite: 87 },
    ],
    [
      70,
      { beginner: 11, novice: 23, intermediate: 41, advanced: 64, elite: 91 },
    ],
    [
      75,
      { beginner: 12, novice: 26, intermediate: 44, advanced: 68, elite: 96 },
    ],
    [
      80,
      { beginner: 14, novice: 28, intermediate: 47, advanced: 72, elite: 100 },
    ],
    [
      85,
      { beginner: 16, novice: 30, intermediate: 50, advanced: 75, elite: 104 },
    ],
    [
      90,
      { beginner: 17, novice: 32, intermediate: 53, advanced: 79, elite: 108 },
    ],
    [
      95,
      { beginner: 19, novice: 34, intermediate: 55, advanced: 82, elite: 112 },
    ],
    [
      100,
      { beginner: 20, novice: 36, intermediate: 58, advanced: 85, elite: 115 },
    ],
    [
      105,
      { beginner: 22, novice: 38, intermediate: 60, advanced: 88, elite: 119 },
    ],
    [
      110,
      { beginner: 23, novice: 40, intermediate: 63, advanced: 91, elite: 122 },
    ],
    [
      115,
      { beginner: 25, novice: 42, intermediate: 65, advanced: 94, elite: 126 },
    ],
    [
      120,
      { beginner: 26, novice: 44, intermediate: 68, advanced: 96, elite: 129 },
    ],
    [
      125,
      { beginner: 27, novice: 46, intermediate: 70, advanced: 99, elite: 132 },
    ],
    [
      130,
      { beginner: 29, novice: 47, intermediate: 72, advanced: 102, elite: 135 },
    ],
    [
      135,
      { beginner: 30, novice: 49, intermediate: 74, advanced: 104, elite: 138 },
    ],
    [
      140,
      { beginner: 31, novice: 51, intermediate: 76, advanced: 107, elite: 141 },
    ],
  ],
  'Seated Cable Row': [
    [
      79,
      { beginner: 45, novice: 64, intermediate: 87, advanced: 114, elite: 143 },
    ],
  ],
}

function interpolateStandards(
  lowerBw: number,
  lower: Standards,
  upperBw: number,
  upper: Standards,
  targetBw: number,
): Standards {
  const t = (targetBw - lowerBw) / (upperBw - lowerBw)
  const lerp = (a: number, b: number) => Math.round(a + t * (b - a))
  return {
    beginner: lerp(lower.beginner, upper.beginner),
    novice: lerp(lower.novice, upper.novice),
    intermediate: lerp(lower.intermediate, upper.intermediate),
    advanced: lerp(lower.advanced, upper.advanced),
    elite: lerp(lower.elite, upper.elite),
  }
}

function lookupStandards(
  multi: MultiStandards,
  bodyweightKg: number,
): Standards {
  if (multi.length === 1) return multi[0][1]
  if (bodyweightKg <= multi[0][0]) return multi[0][1]
  if (bodyweightKg >= multi[multi.length - 1][0])
    return multi[multi.length - 1][1]
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

export type StrengthLevel =
  | 'Beginner'
  | 'Novice'
  | 'Intermediate'
  | 'Advanced'
  | 'Elite'
  | 'Unknown'

// Tailwind classes for badge UI
export const strengthLevelBadge: Record<StrengthLevel, string> = {
  Beginner: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Novice: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-green-500/20 text-green-300 border-green-500/30',
  Advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Elite: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Unknown: 'bg-slate-700/20 text-slate-500 border-slate-700/30',
}

// Hex fill colors for SVG/canvas use
export const strengthLevelColor: Record<StrengthLevel, string> = {
  Beginner: '#94a3b8',
  Novice: '#60a5fa',
  Intermediate: '#4ade80',
  Advanced: '#fb923c',
  Elite: '#c084fc',
  Unknown: '#475569',
}

export function getStrengthLevel(
  exercise: string,
  userBodyweightKg: number,
  setWeightKg: number,
  reps: number,
): StrengthLevel {
  const multi = STRENGTH_STANDARDS[exercise] as MultiStandards | undefined
  if (!multi) return 'Unknown'

  const standards = lookupStandards(multi, userBodyweightKg)
  const isBodyweight = BODYWEIGHT_EXERCISES.has(exercise) && setWeightKg === 0
  const value = isBodyweight ? reps : oneRepMax(setWeightKg, reps)

  if (value >= standards.elite) return 'Elite'
  if (value >= standards.advanced) return 'Advanced'
  if (value >= standards.intermediate) return 'Intermediate'
  if (value >= standards.novice) return 'Novice'
  return 'Beginner'
}
