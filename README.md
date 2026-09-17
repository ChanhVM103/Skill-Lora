# Skillora

Skillora is an MVP hackathon product for **Track 1 - Future Skills Readiness**.

Skillora helps students turn an existing CV into a practical career-readiness plan. Instead of only saying whether a CV is good or bad, the system identifies the gap between the student's current evidence and a target role, then turns that gap into an actionable level-up blueprint and a 4-week learning roadmap with suggested learning videos/resources.

## Track 1 Pain Point

Students often struggle with career readiness because they cannot clearly answer:

- Which skills in my CV are actually proven by evidence?
- Which skills are missing for my target role?
- Am I overstating my level compared with what I can explain in an interview?
- What should I learn first in the next 4 weeks?
- Which project or feature should I build to prove the missing skills?
- Which learning resources should I use instead of searching randomly?

For teachers and mentors, the pain point is also operational: it is hard to quickly inspect many students' CVs, detect repeated skill gaps, and recommend relevant resources consistently.

## How Skillora Solves It

Skillora provides an AI-assisted but structured career-readiness workflow:

1. The student uploads a CV and selects a target role such as `frontend_reactjs`, `backend_developer`, `data_analyst`, or `ai_engineer`.
2. The backend extracts CV text and creates a baseline hypothesis about the student's current level.
3. The system generates role-specific interview questions across Technology, System, People, and Process axes.
4. The student submits answers so the system can verify whether the CV claims are backed by real explanation.
5. The evaluator produces an `actionable_level_up_blueprint` containing required skills, practical features to build, and English improvement actions.
6. The roadmap generator converts that blueprint into a 4-week learning roadmap and attaches YouTube learning suggestions.
7. Teachers can add internal resources, and the roadmap can show where internal resources are missing.

The core product value is simple: **Skillora turns CV evidence into a personalized skill-gap diagnosis and a short, actionable learning plan.**

## Current End-to-End Backend Flow

```txt
POST /analyses/baseline
CV upload + target role
-> Extract CV text
-> Parse baseline profile
-> Generate interview questions
-> Save session

POST /analyses/:id/submit-answers
Candidate answers
-> Verify CV claims with rubric
-> Score Technology/System/People/Process axes
-> Produce actionable_level_up_blueprint
-> Save final evaluation

GET /cv/history/:id or GET /analyses/:id
-> Retrieve target_role, scores, evidence ledger, actionable_level_up_blueprint

POST /roadmaps/generate
Target role + actionable_level_up_blueprint
-> Convert blueprint into gap items
-> Score/prioritize gaps
-> Generate exactly 4 weeks
-> Try configured Gemini model, then fallback models
-> Attach YouTube video suggestions
-> Cache AI roadmap and YouTube results
```

## What The System Outputs

The CV evaluation result includes:

- `target_role`
- verified current level and next target level
- scores by axis: Technology, System, People, Process
- evidence ledger from interview answers
- `actionable_level_up_blueprint`

The roadmap result includes:

- `estimated_duration_weeks: 4`
- prioritized `improvement_items`
- `four_week_plan`
- YouTube video suggestions per lesson
- AI generation status and fallback metadata
- resource gap alerts for missing teacher resources

## Processing Principles

Skillora is designed as **deterministic-first**:

- LLMs may help parse, summarize, or generate structured learning plans.
- Scoring, role matching, skill-gap priority, and roadmap validation must remain controlled by backend rules.
- The roadmap must be constrained to the input blueprint/gap items and must not freely invent unrelated skills.
- The 4-week roadmap is the canonical frontend display format.

## Monorepo Structure

```txt
apps/api  - NestJS backend
apps/web  - React + TypeScript frontend
```

## Run The Project

Install dependencies from the repository root:

```bash
npm install
```

Run the backend API:

```bash
npm run dev:api
```

Run the frontend:

```bash
npm run dev:web
```

Swagger UI:

```txt
http://localhost:3000/docs
```

## Backend Environment

Create `apps/api/.env` from `apps/api/.env.example` and configure values such as:

```env
PORT=3000
APP_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillora
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=optional-for-ai-roadmap-generation
GEMINI_MODEL=optional-preferred-model
```

Do not commit real `.env` values.

## Verification Commands

From the repository root:

```bash
npm run build:api
npm run build:web
```

From `apps/api`:

```bash
npm run test
```
