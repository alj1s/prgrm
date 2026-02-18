# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on https://localhost:3000
npm run build        # Production build
npm run check        # Format (prettier --write) + lint (eslint --fix)
npm run lint         # ESLint only
npm run test         # vitest run (no watch)
npm run db:push      # Push schema changes to DB (may prompt interactively)
npm run db:studio    # Open Drizzle Studio
```

**Running db:push non-interactively**: The prompt requires a real TTY. If it hangs, apply DDL directly via psql:
```bash
DOCKER_HOST=unix:///Users/andrewjones/.colima/default/docker.sock \
  docker exec -i progrm-postgres psql -U progrm -d progrm <<'SQL'
-- your ALTER TABLE statements
SQL
```
Then re-run `db:push` to sync the snapshot (it will say "No changes detected").

**Adding Shadcn components**:
```bash
pnpm dlx shadcn@latest add <component>
```

## Architecture

### Request flow
TanStack Start provides SSR + file-based routing. Each route file can export `createServerFn` calls that run only on the server (Node.js / Vite SSR). The `loader` on the `Route` object fetches initial data server-side; mutations use `createServerFn({ method: 'POST' })`.

```
src/routes/
  __root.tsx        # Shell: <Header>, TanStackQueryProvider, devtools
  index.tsx         # Main app: loader + server fns + all workout UI
  sign-in.tsx       # Standalone sign-in page
  api/auth/$.ts     # Better Auth catch-all API handler
```

All application logic currently lives in `src/routes/index.tsx`: the `getPageData` loader, `logWorkout` and `deleteWorkout` server fns, and the React components (`LogWorkoutForm`, `WorkoutCard`, `App`, `SignInForm`).

### Data layer
- **ORM**: Drizzle + `pg` driver. Client is in `src/db/index.ts`.
- **Schema** (`src/db/schema.ts`): `workout_sessions` (date, bodyweight_kg), `workout_sets` (session_id FK cascade, exercise, weight_kg real, reps, strength_level), `exercises` (name, category), plus the four Better Auth tables.
- **Weights** are stored in **kg** (`weight_kg real` for 0.5 kg precision). Body weight is `bodyweight_kg integer` on the session.
- **`DATABASE_URL`** is read from `.env.local` or `.env`.

### Auth
Better Auth with email/password. Auth state is checked **client-side** with `authClient.useSession()` — do not try to call `auth.api.getSession()` inside server fns in route files (Vite bundling issue with virtual modules). The `tanstackStartCookies` plugin handles cookie setting via dynamic import internally.

### Strength standards (`src/lib/strength-standards.ts`)
`STRENGTH_STANDARDS` is `Record<string, [bodyweightKg: number, Standards][]>` — a multi-bracket table sorted ascending by lifter body weight. `lookupStandards` clamps and linearly interpolates between brackets. `getStrengthLevel(exercise, userBodyweightKg, setWeightKg, reps)` returns a `StrengthLevel`. Bodyweight exercises (pull-ups, push-ups, etc.) use rep counts instead of 1RM and are listed in `BODYWEIGHT_EXERCISES`.

### Styling
Tailwind CSS v4. UI primitives from Shadcn (installed via `pnpm dlx shadcn@latest add`). The `cn()` helper (`src/lib/utils.ts`) merges class names with `clsx` + `tailwind-merge`.

### Module alias
`#/*` maps to `./src/*` (configured in `package.json` `imports` and `vite-tsconfig-paths`). Use `#/db/schema`, `#/lib/auth-client`, etc.
