# IELTS Prep Platform: Hands-on Guide

Follow this guide to run the app on your own machine, see how it works, and take some reading tests. It covers:

1. [How the app works](#1-how-the-app-works)
2. [Start it locally](#2-start-it-locally)
3. [Take your first test](#3-take-your-first-test)
4. [Check your answers](#4-check-your-answers)
5. [Try the teacher side](#5-try-the-teacher-side)
6. [Suggested test plan](#6-suggested-test-plan)

The diagrams are Mermaid, so they render on GitHub and in VS Code's Markdown preview.

---

## 1. How the app works

There are two kinds of users:

- **Students** take timed tests and see their scores.
- **Teachers** create courses and review what students submitted.

```mermaid
flowchart LR
    T[Teacher] -->|creates| C[Course]
    C --> M[Modules<br/>e.g. Practice Test 1]
    M --> K[Tasks<br/>passages and mock tests]
    S[Student] -->|enrolls with Course ID| C
    S -->|takes| K
    K -->|submit| G[Auto-grader<br/>score and band]
    G --> R[Review page<br/>every question, right or wrong]
    T -->|sees all submissions| R
```

### What's in the reading course

There are 3 practice tests. Each one has 3 original passages and 40 questions, like the real Academic Reading paper.

| Test | Passage 1 | Passage 2 | Passage 3 |
|---|---|---|---|
| 1 | Urban Beekeeping | Teenage Sleep | Machine Creativity |
| 2 | Shipping Containers | Coral Restoration | The Psychology of Choice |
| 3 | Vertical Farming | Standard Time | Bilingualism |

Each test can be taken in two ways:

| Task | Time | Attempts | Fullscreen lockdown | Use it for |
|---|---|---|---|---|
| **Passage 1, 2, 3** (about 13 questions each) | 20 min | 99 | No | Practising one passage at a time |
| **Full Mock Test** (40 questions) | 60 min | 3 | Yes | Exam conditions |

The tests cover every IELTS reading question type:

- True/False/Not Given and Yes/No/Not Given
- Multiple choice
- Matching headings, information, features and sentence endings
- Sentence, summary, note, table and flow-chart completion
- Diagram labelling and short answer

### What happens during a test

```mermaid
flowchart TD
    A[Open the task] --> B{Attempt already<br/>in progress?}
    B -- No --> C[Start: timer begins]
    B -- Yes, time left --> D[Resume with your<br/>saved answers]
    B -- Yes, time ran out --> E[Auto-submitted]
    C --> F[Answer questions<br/>passage left, questions right]
    D --> F
    F -->|every change| SAVE[(Autosaved)]
    F --> L{Mock test?}
    L -- Yes --> LK[Fullscreen lockdown<br/>2nd violation auto-submits]
    L -- No --> SUB
    LK --> SUB{Submit or timer ends}
    SUB --> GR[Graded instantly]
    E --> GR
    GR --> RV[Review page:<br/>score, band, each answer<br/>next to the correct one]
```

Good to know:

- **Your answers are saved as you type.** If you close the tab or reload, click **Start / Resume Test** and you continue where you left off. The timer keeps running while you're away.
- **Marking is like the real exam, but forgiving about case and spacing.** `Cell Wall`, `cell wall` and ` cell  wall ` all count as the same answer. Spelling must be exact, and you must stay within the word limit in the instructions.
- **Bands for one passage are estimates.** A single-passage score is scaled up to 40 questions before it is converted to a band, so 10/13 is treated as about 31/40.

---

## 2. Start it locally

You need Node 22 or later. Use **three terminals**, all opened in the project folder.

### First time only

```bash
npm ci --prefix backend
npm ci --prefix frontend
```

Make sure `backend/.env` contains these lines (copy from `backend/.env.example` if needed):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ielts"
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/ielts"
```

### Every time

```mermaid
flowchart LR
    T1["Terminal 1<br/>npm run db:local"] --> T2["Terminal 2<br/>npm run dev:api"]
    T2 --> T3["Terminal 3<br/>npm run dev:web"]
    T3 --> B["Browser<br/>http://localhost:5173"]
```

| Terminal | Command | Leave it running? |
|---|---|---|
| 1 | `npm run db:local` | Yes. This is the database. |
| 2 | `npm run dev:api` | Yes. This is the API on port 4000. |
| 3 | `npm run dev:web` | Yes. This is the website on port 5173. |

### First time only: fill the database

Run this in a 4th terminal once Terminal 1 is up:

```bash
cd backend
npx prisma migrate deploy   # create the tables
npm run seed                # demo teacher, demo student and the course (run only once)
npm run seed:reading        # the 3 reading practice tests
```

Then open **http://localhost:5173**.

### Demo accounts

These are for local use only and never exist on the live site.

| Role | Email | Password |
|---|---|---|
| Student | `student@example.com` | `password123` |
| Teacher | `teacher@example.com` | `password123` |

The demo student is already enrolled in **IELTS Preparation**.

---

## 3. Take your first test

```mermaid
flowchart TD
    L[Log in as the student] --> D[Student dashboard]
    D --> CO[Click IELTS Preparation]
    CO --> MOD["Pick a module<br/>Academic Reading: Practice Test 1"]
    MOD --> TK[Pick a task<br/>start with Passage 1]
    TK --> ST[Start / Resume Test]
    ST --> ANS[Answer the questions]
    ANS --> SUB[Submit, then Submit now]
    SUB --> REV[Review page]
    REV --> RES[My results:<br/>all your attempts]
```

Step by step:

1. Log in as `student@example.com`.
2. Click **IELTS Preparation**. Each module shows your progress, such as "1/4 done".
3. Open **Academic Reading: Practice Test 1**, then **T1 Passage 1: Urban Beekeeping**.
4. Read the instructions, then click **Start / Resume Test**.
5. The passage is on the left and the questions are on the right.
   - The numbered navigator at the bottom shows which questions you've answered. Click a number to jump to that question.
   - In a mock test, use the tabs to switch between Passage 1, 2 and 3.
6. Click **Submit**. If you still have blank answers, you'll be asked to confirm. Click **Submit now**.
7. The **Review page** shows:
   - your score and estimated band;
   - every question with your answer, the correct answer and a ✓ or ✗.

To open a past review again, click **My results** (or **View my results** on the dashboard) and then **Review**.

> **Mock test tip:** the full mock opens in fullscreen. Leaving fullscreen, switching tabs, copy/paste and devtools shortcuts each count as a violation. The first one shows a warning; **the second one auto-submits your test.** Your teacher sees the count. Do the mock when you have an uninterrupted hour.

---

## 4. Check your answers

The review page already marks every answer. If you want a second opinion or a breakdown, there are two options.

**Ask Claude.** Say something like *"I submitted Test 1 Passage 2, check my answers."* Claude runs the review script, explains each wrong answer from the passage and points out patterns, for example "you mix up False and Not Given".

**Run the review script yourself**, from `backend/`:

```bash
npm run review:reading                  # your latest submitted reading attempt
npm run review:reading -- --all         # list every attempt
npm run review:reading -- <submissionId>
npm run review:reading -- --stats       # accuracy by question type across all attempts
```

`--stats` is the most useful one after a few tests. It shows which question types to practise next.

---

## 5. Try the teacher side

```mermaid
flowchart LR
    TL[Log in as the teacher] --> TD[Teacher dashboard]
    TD --> TC[Open the course]
    TC --> ID[Copy the Course ID<br/>students use it to enroll]
    TC --> SV[Submissions]
    SV --> TR[Click Review on any<br/>student's attempt]
    SV --> VI[See lockdown violations<br/>for mock tests]
```

1. Log out, then log in as `teacher@example.com`.
2. Open **IELTS Preparation** and click **Submissions**. You'll see the test you just took as the student.
3. Click **Review** to see the same question-by-question page that the student sees.

New sign-ups are always students. To try the full student journey, register a new account, then enrol using the **Course ID** shown on the teacher's course page.

---

## 6. Suggested test plan

A first session of about 2.5 hours, which builds from short passages to full exam conditions:

| # | Task | Time | Why |
|---|---|---|---|
| 1 | T1 Passage 1: Urban Beekeeping | 20 min | Easiest passage; get used to the screen |
| 2 | T1 Passage 2: Teenage Sleep | 20 min | Matching headings and information |
| 3 | T1 Passage 3: Machine Creativity | 20 min | Hardest passage type: Yes/No/Not Given and summary |
| 4 | Check: `npm run review:reading -- --stats` | 5 min | Find your weakest question type |
| 5 | **T2 Full Mock Test** | 60 min | Real exam conditions, all 40 questions in one sitting |
| 6 | Review the mock, then retry weak passages from Test 3 | 20–40 min | Targeted practice |

After each test, write down your result:

| Date | Task | Score | Band | Weakest question type |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

### Checklist for trying out the app itself

Use this to test the app, not just your reading:

- [ ] Reload the page mid-test. Your answers are still there after **Start / Resume Test**.
- [ ] Leave a passage test open past 20 minutes. It auto-submits.
- [ ] In the mock, press Esc once. You get a warning and the teacher sees 1 violation. A second one auto-submits. This uses up 1 of your 3 mock attempts.
- [ ] Type an answer in different capitals or with extra spaces. It is still marked correct.
- [ ] Register a new student and enrol with the Course ID.
- [ ] As the teacher, find that new student's submission and open the review.
- [ ] Try 4 attempts on a mock test. The 4th is blocked (limit is 3).

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Can't reach database server at localhost:5433` | Terminal 1 (`npm run db:local`) isn't running. |
| `EADDRINUSE :4000` | An old API is still running. Close that terminal or run `fuser -k 4000/tcp`. |
| The course has no reading tests | Run `npm run seed:reading` in `backend/`. |
| `No teacher teacher@example.com` from seed:reading | Run `npm run seed` first. |
| Log in fails for demo accounts | `npm run seed` hasn't been run against this database. |
