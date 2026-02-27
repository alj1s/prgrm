import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema.ts'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL env var is required')

const pool = new Pool({
  connectionString: url,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
})

export const db = drizzle(pool, { schema })
