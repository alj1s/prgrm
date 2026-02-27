const { Pool } = require('pg')

const p = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const stmts = [
  `CREATE TABLE IF NOT EXISTS "user" (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    email_verified boolean NOT NULL,
    image text,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS session (
    id text PRIMARY KEY,
    expires_at timestamp NOT NULL,
    token text NOT NULL UNIQUE,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS account (
    id text PRIMARY KEY,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp,
    refresh_token_expires_at timestamp,
    scope text,
    password text,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS verification (
    id text PRIMARY KEY,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp NOT NULL,
    created_at timestamp,
    updated_at timestamp
  )`,
  `CREATE TABLE IF NOT EXISTS workout_sessions (
    id serial PRIMARY KEY,
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    date text NOT NULL,
    bodyweight_kg integer NOT NULL DEFAULT 79,
    hevy_workout_id text UNIQUE,
    created_at timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS workout_sets (
    id serial PRIMARY KEY,
    session_id integer NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise text NOT NULL,
    weight_kg real NOT NULL DEFAULT 0,
    reps integer NOT NULL,
    strength_level text NOT NULL,
    created_at timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS exercises (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    category text NOT NULL,
    created_at timestamp DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS user_settings (
    user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    bodyweight_kg integer,
    hevy_api_key text
  )`,
]

async function run() {
  for (const s of stmts) {
    const label = s.trim().split('\n')[0].slice(0, 60)
    await p.query(s)
    console.log('ok:', label)
  }
  await p.end()
  console.log('Migration complete.')
}

run().catch((e) => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
