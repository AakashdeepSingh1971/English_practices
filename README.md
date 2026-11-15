# IELTS Prep Platform

A multi-user IELTS test-prep platform built so it can later generalize into broader teaching software: courses contain modules, modules contain tasks, students take tasks under an optional monitored/lockdown mode, and submissions are graded either objectively (answer key) or manually by a teacher.

## Status: Phase 1 complete

What works right now:
- Auth with roles (`STUDENT` / `TEACHER_ADMIN`), JWT access token + httpOnly refresh cookie. Public sign-up creates students only.
- Generic Course → Module → Task → Submission → Grade data model (not IELTS-hardcoded — a `Task`'s `contentJson` just holds whatever shape its type needs).
- Teacher: create courses, modules, tasks (with a JSON content editor), answer keys; view roster, submissions, and violation logs; manually set/override grades.
- Student: enroll in a course, take Listening/Reading tasks, get instant auto-graded band scores (official IELTS raw-score → band conversion tables).
- **Monitored test ("lockdown") mode**: fullscreen enforcement, tab-switch/blur detection, blocked copy/paste/right-click/devtools shortcuts, auto-submit after repeated violations, full violation audit log visible to teachers. This is a **best-effort browser-level deterrent**, not OS-level enforcement — a second device or screen-mirroring can't be detected from JS. The UI is worded as "monitored test environment" rather than claiming true lockdown.
- In-progress answers autosave on every change to IndexedDB (instant, survives a refresh) and the backend (durable, multi-device). Leaving a test and coming back resumes the same attempt; the timer keeps running from the original start, and an attempt whose time ran out is submitted with its saved answers.
- **Reading practice library**: original IELTS Academic Reading tests (3 passages, 40 questions, 2,150–2,750 words each), covering all 11 official question types. Each test is offered as three 20-minute passage tasks plus a 60-minute monitored mock test.
- **Test screen**: passage and questions side by side, passage tabs for multi-passage tests, a question navigator, and an inline confirmation before submitting with blank answers.
- **Answer review** (`/results/:submissionId`): score, band, accuracy by question type, each answer against the key, the passage on demand, and a mistakes-only filter. Available to the student after submitting and to the course's teacher.
- Course page shows per-task progress (not started / in progress / attempts and best band).

Not yet built (see Phases 2-4 below): Writing/Speaking tasks, Claude-based AI grading, audio recording/transcription, analytics dashboards.

## Project structure

```
backend/      Express + TypeScript + Prisma (PostgreSQL) API
frontend/     Vite + React + TypeScript app
api/index.js  Vercel serverless function wrapping the Express app
vercel.json   Vercel build, output and routing
Dockerfile    alternative: one container serving both
package.json  root scripts: build, build:vercel, start, test, db:local, dev:api, dev:web
```

## Setup (local development)

```bash
cd backend && npm install && cp .env.example .env   # edit secrets if needed
cd ../frontend && npm install && cd ..
```
Run each of these in its own terminal from the repo root:
```bash
npm run db:local   # PostgreSQL on localhost:5433, no install needed (data in backend/.pgdata)
npm run dev:api    # API on http://localhost:4000
npm run dev:web    # app on http://localhost:5173 (open this one)
```
First time only, with `db:local` running:
```bash
cd backend
npx prisma migrate deploy   # create the tables
npm run seed                # sample teacher/student (dev only: password123 logins)
npm run seed:reading        # the reading practice tests
```
Vite forwards `/api` to the backend, so the app and the API share one origin in development, as on Vercel.

## Deployment: Vercel + Supabase

Vercel serves the built React app from its CDN and runs the Express API as one serverless function
(`api/index.js`). Everything is configured in `vercel.json`. Vercel has no persistent disk, so the database
is Supabase PostgreSQL.

**1. Create the database.** On supabase.com create a project (pick the region closest to your Vercel
functions; Vercel's default is Washington, D.C., `iad1`). In the project, open **Connect** and copy two strings:
- **Transaction pooler** (port 6543). Append `?pgbouncer=true&connection_limit=1`. This is `DATABASE_URL`.
- **Session pooler** (port 5432). This is `DIRECT_URL`, used only for migrations. (Use the pooler, not the
  "direct connection" host: that one is IPv6-only and Vercel's build machines can't reach it.)

**2. Create the Vercel project.** Import the GitHub repo in Vercel, keep the root directory as the repo root and
the framework preset as "Other" (`vercel.json` sets the install, build and output settings). Add these
environment variables:

| Variable | Environments | Value |
|---|---|---|
| `DATABASE_URL` | Production (+ Preview, see below) | transaction pooler URL from step 1 |
| `DIRECT_URL` | Production (+ Preview) | session pooler URL from step 1 |
| `JWT_ACCESS_SECRET` | all | long random string (`openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | all | a different long random string |

Then deploy. Production deploys run `prisma migrate deploy` during the build, so the first one creates the
tables and later ones apply new migrations. Preview deploys skip migrations so a pull request can't change
the live schema; if previews share the production database, they must not depend on unmerged schema changes.

**3. First-time setup**, from your machine, pointing the scripts at Supabase (use the session pooler URL for both):
```bash
cd backend
export DATABASE_URL='<session pooler url>' DIRECT_URL='<session pooler url>'
TEACHER_PASSWORD='a long password' npm run create-teacher -- you@example.com "Your Name"
TEACHER_EMAIL=you@example.com npm run seed:reading
```
Public sign-up only creates **student** accounts; teachers are created with `create-teacher`.
Students join a course by entering its course ID on their dashboard (the ID is in the course page's address).
Never run `npm run seed` against Supabase: it creates accounts with the password `password123`.

**Other hosts.** The same code also runs as one long-lived server: `npm run build` then `npm start` from the
repo root, or the `Dockerfile`. There the Express server also serves the built app. It still needs
`DATABASE_URL`, `DIRECT_URL` and the two JWT secrets.

## Reading practice tests
```bash
cd backend
npm run seed:reading              # adds new tests; refreshes tests nobody has taken yet
npm run seed:reading -- --force   # also replaces tests that have submissions (deletes them)
npm run review:reading            # latest reading attempt, question by question
npm run review:reading -- --stats # accuracy by question type across all attempts
```
Each test lives in `backend/prisma/reading/tests/testNN.ts` and is registered in `tests/index.ts`.
Question ids are `q1`–`q40` across the whole paper, so a single-passage task keeps official numbering
(Passage 2 starts at 14). Single-passage scores are scaled to 40 before the band lookup.

## Tests
```bash
cd backend
npm test   # unit + API integration + reading-content checks
```
Tests start their own throwaway PostgreSQL (no install needed) and apply the migrations from scratch on
every run; the dev and production databases are never touched. Set `TEST_DATABASE_URL` to use an existing
server instead (e.g. in CI). The content checks verify every practice test has 40 correctly numbered
questions, a valid answer for every choice question, written answers within the stated word limit and
present in the passage, and a total length within the real exam range.

## Seeded logins (development only)
- Teacher: `teacher@example.com` / `password123`
- Student: `student@example.com` / `password123`

## Content authoring (Phase 1)

A teacher adds a task via a JSON content editor in the course page. Shape:
```json
{
  "instructions": "...",
  "passage": "... (Reading only, optional)",
  "audioUrl": "https://... (Listening only, optional — not hosted anywhere yet, bring your own URL)",
  "questions": [
    { "id": "q1", "prompt": "...", "type": "SHORT_ANSWER" },
    { "id": "q2", "prompt": "...", "type": "MULTIPLE_CHOICE", "options": ["A. ...", "B. ...", "C. ...", "D. ..."] }
  ]
}
```
A choice's stored value is its label before `". "` (`"A. ..."` → `A`, `"iv. ..."` → `iv`), or the whole option when it has no label (`"NOT GIVEN"`).
Multi-passage tasks use `"sections": [{ "title", "passage", "questions": [...] }]` instead of `passage`/`questions`; a question may carry a `group` instruction and a monospace `figure` shown above it.
Answer key (Listening/Reading only — Writing/Speaking have no answer key, they're graded manually or, from Phase 2, by AI):
```json
{ "q1": "exact or array of accepted answers", "q2": "B" }
```

## Phased roadmap

1. **Phase 1 (done)** — everything listed above.
2. **Phase 2** — Writing module: essay editor, Claude API grading against official band descriptors, teacher override UI.
3. **Phase 3** — Speaking module: in-browser recording (`MediaRecorder`), transcript capture (`Web Speech API`, Chrome-only — this limitation will be visible in the UI), reuse of the Phase 2 AI-grading pipeline with a pronunciation-scoring caveat.
4. **Phase 4** — analytics/progress dashboards, violation-log dashboard, CSV export, richer visual question authoring (replacing the raw JSON editor).

For Phase 2+, set `ANTHROPIC_API_KEY` in `backend/.env` (never commit it — it's already gitignored via `.env`).

## Notes on the lockdown mode

This is explicitly a deterrent, not a guarantee — confirmed and accepted during planning. It:
- Requests fullscreen on test start (must be a user-gesture click, which is why there's a "Start Test" button rather than auto-starting).
- Logs a violation on tab-blur, fullscreen-exit, copy/paste/cut, right-click, and common devtools shortcuts (F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U).
- Auto-submits after 2 violations (see `MAX_VIOLATIONS_BEFORE_AUTO_SUBMIT` in `backend/src/routes/attempts.routes.ts`).
- Treats events within 1.5 s of each other as one action (Alt+Tab fires blur, visibilitychange and fullscreenchange together), and stops accepting violations once the attempt has ended.
- Persists every violation server-side immediately, so a refresh mid-test doesn't lose the audit trail, and teachers can see exactly what happened on any flagged attempt.
