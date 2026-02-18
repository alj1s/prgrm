# prgrm

A workout tracking app built with TanStack Start, TanStack Query, Shadcn/ui, Drizzle ORM, and Better Auth.

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Database | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Better Auth](https://better-auth.com) (email + password) |
| UI | [Shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (or Docker — see below)

### Environment

Copy `.env.local` and fill in your values:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/prgrm"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### PostgreSQL with Docker

```bash
docker run -d \
  --name prgrm-postgres \
  -e POSTGRES_USER=prgrm \
  -e POSTGRES_PASSWORD=prgrm \
  -e POSTGRES_DB=prgrm \
  -p 5432:5432 \
  postgres:16-alpine
```

### Install & run

```bash
npm install
npm run db:push   # create tables
npm run dev       # start dev server on port 3000
```

## Database

Drizzle is used for all database access. The schema lives in `src/db/schema.ts`.

```bash
npm run db:push      # push schema changes directly (dev)
npm run db:generate  # generate a migration file
npm run db:migrate   # run pending migrations
npm run db:studio    # open Drizzle Studio
```

To seed the workout data:

```bash
DATABASE_URL="..." npx tsx src/db/seed.ts
```

## Auth

Authentication is handled by Better Auth at `/api/auth/*`. Sign in and sign up are available at `/sign-in`. The signed-in user is shown in the sidebar with a sign-out button.

## Project Structure

```
src/
├── db/
│   ├── index.ts          # Drizzle client
│   ├── schema.ts         # All table definitions (workouts + auth)
│   └── seed.ts           # Seed script for workout data
├── lib/
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client (useSession, signIn, signOut)
│   └── utils.ts          # cn() utility
├── integrations/
│   ├── better-auth/      # Auth header component
│   └── tanstack-query/   # Query provider + devtools
├── components/
│   └── Header.tsx        # Sidebar nav with auth state
└── routes/
    ├── __root.tsx         # Root layout
    ├── index.tsx          # Home — recent workouts
    ├── sign-in.tsx        # Sign in / sign up
    └── api/auth/$.ts      # Better Auth API handler
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Run tests (Vitest)
npm run lint     # ESLint
npm run check    # Prettier + ESLint fix
```
