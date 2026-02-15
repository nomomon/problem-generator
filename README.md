# Problem Generator (InfPrep)

Web app for creating and managing **scalable math word problems** via JavaScript code generators. Each problem is a `generateProblem()` function that uses template strings and randomizers so every run yields a new, valid instance. The built-in AI assistant helps you transcribe problems, generate code from text, paraphrase, adjust difficulty, and fix bugs.

## What it does

- **Dashboard** — list, create, edit, and delete problems. Each problem stores a JS generator, metadata (name, difficulty, topics), and optional assets.
- **Problem editor** — Monaco code editor, live code runner (sandboxed), and an AI chat with tools to read/update the generator code. The AI is tuned for InfPrep: it understands the `{ text, answerText, variables }` contract and can suggest or apply edits.
- **Auth** — Supabase for sign-in; optional for local use if you skip protected routes.
- **Data** — PostgreSQL (Neon or any Postgres) via Drizzle; problems, topics, and source/edition metadata.

## Tech stack

- **Next.js 15** (App Router, Turbopack), **React 19**
- **Supabase** (auth)
- **Drizzle ORM** + **Postgres** (Neon serverless or standard Postgres)
- **Vercel AI SDK** + **OpenAI** for the chat agent
- **Monaco** for the editor, **shadcn/ui** + **Tailwind** for the UI

## How to run

1. **Clone and install**

   ```bash
   git clone https://github.com/nomomon/problem-generator.git
   cd problem-generator
   pnpm install
   ```

2. **Environment**

   Create `.env.local` (and optionally `.env`) with:

   - `DATABASE_URL` — Postgres connection string (e.g. Neon)
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
   - `OPENAI_API_KEY` — for the AI chat in the problem editor

3. **Database**

   ```bash
   pnpm drizzle-kit push
   # or: pnpm drizzle-kit generate && pnpm drizzle-kit migrate
   ```

4. **Dev server**

   ```bash
   pnpm dev
   ```

   Opens at `http://localhost:3000`; root redirects to `/dashboard`.

## Scripts

| Command       | Description                |
|--------------|----------------------------|
| `pnpm dev`   | Next dev with Turbopack    |
| `pnpm build` | Production build           |
| `pnpm start` | Run production server      |
| `pnpm lint`  | Biome check                |
| `pnpm format`| Biome format               |

## Repo note

This repo is the **problem-generator** piece of the InfPrep platform (codebase name in `package.json`: `inf-prep-web`). The UI is in Russian (e.g. «Панель», «Задачи», «Создать задачу»). The AI prompt and tools are under `lib/ai/` and are designed so the agent can read the current generator file and apply edits via a single replace tool, keeping problems consistent and scalable.
