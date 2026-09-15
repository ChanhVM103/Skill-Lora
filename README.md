# Skillora

Skillora is an MVP hackathon product for Track 1 - Future Skills Readiness.

The product is an AI Skill Gap Coach for students. Students upload a CV and optionally a transcript, select a target career role, and receive a structured readiness report with skill gaps, deterministic scores, prioritized learning actions, and teacher-curated resource recommendations.

## Monorepo Structure

```txt
apps/api  - NestJS backend
apps/web  - React + TypeScript frontend
```

## Current Backend Status

Completed foundation work:

- NestJS API scaffold is available in `apps/api`.
- Swagger is configured.
- Health check endpoint is available.
- MongoDB is connected through `MONGODB_URI`.
- User schema is created with Mongoose.
- JWT authentication is available.

Current backend endpoints:

```http
GET  /health
POST /auth/register
POST /auth/login
GET  /auth/me
```

Swagger UI:

```txt
http://localhost:3000/docs
```

Health check:

```txt
http://localhost:3000/health
```

## Backend Environment

Create `apps/api/.env` from `apps/api/.env.example`:

```env
PORT=3000
APP_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillora
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
```

Do not commit real `.env` values.

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

Build the backend:

```bash
npm run build:api
```

Build the frontend:

```bash
npm run build:web
```

## Auth Flow

Register creates a student user and does not return a JWT token:

```http
POST /auth/register
```

Example request:

```json
{
  "email": "student@skillora.local",
  "fullName": "Nguyen Van A",
  "password": "StrongPass123"
}
```

Example response:

```json
{
  "user": {
    "id": "...",
    "email": "student@skillora.local",
    "fullName": "Nguyen Van A",
    "role": "student"
  }
}
```

Login returns the JWT access token:

```http
POST /auth/login
```

Example response:

```json
{
  "user": {
    "id": "...",
    "email": "student@skillora.local",
    "fullName": "Nguyen Van A",
    "role": "student"
  },
  "accessToken": "..."
}
```

Use the token for protected endpoints:

```http
Authorization: Bearer <accessToken>
```

## MVP Backend Pipeline

The intended analysis flow is deterministic-first:

```txt
File upload
-> parser/OCR text extraction
-> text quality check
-> LLM extraction only
-> deterministic validation
-> deterministic scoring
-> role/JD matching
-> gap engine
-> prioritized actions
-> structured JSON response
-> persistence
```

Critical rule: LLM may only parse raw CV/transcript text into normalized JSON. It must not score students, calculate GPA, rank candidates, invent skills, decide gap severity, or create final prioritized actions.

## Target Analysis Endpoint

The next major API contract is:

```http
POST /analyses
```

Input type:

```txt
multipart/form-data
```

Fields:

- `cv_file`: required file
- `transcript_file`: optional file
- `target_role`: required enum, one of `data_analyst`, `backend_developer`, `ai_engineer`
- `jd_text`: optional string

Expected response should include:

- `analysis_id`
- `status`
- `parsed_cv`
- `parsed_transcript`
- `scores`
- `ats_checks`
- `academic_checks`
- `role_match`
- `evidence_ledger`
- `gap_items`
- `prioritized_actions`
- `recommended_resources`
- `metadata`

## Verification Commands

From the repository root:

```bash
npm run build:api
npm run dev:api
```

From `apps/api`:

```bash
npm run test
```

## Notes

- If port `3000` is busy, set another port in `apps/api/.env`, for example `PORT=3001`.
- Swagger is available only while the backend server is running.
- MongoDB must be reachable through `MONGODB_URI` before the API can start successfully.
