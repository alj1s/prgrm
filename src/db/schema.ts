import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

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

// better-auth tables
export const user = pgTable('user', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
  id: text().primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text().primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text(),
  password: text(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
