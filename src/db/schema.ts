import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const workoutSessions = pgTable('workout_sessions', {
  id: serial().primaryKey(),
  date: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const workoutSets = pgTable('workout_sets', {
  id: serial().primaryKey(),
  sessionId: integer('session_id')
    .notNull()
    .references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exercise: text().notNull(),
  weightLbs: integer('weight_lbs').notNull().default(0),
  reps: integer().notNull(),
  strengthLevel: text('strength_level').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
