import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '#/db/index'
import { user, session, account, verification } from '#/db/schema'

const secret = process.env.BETTER_AUTH_SECRET
if (!secret) throw new Error('BETTER_AUTH_SECRET env var is required')

export const auth = betterAuth({
  secret,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  rateLimit: {
    enabled: true,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
