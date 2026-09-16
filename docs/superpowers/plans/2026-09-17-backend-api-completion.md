# Backend API Completion Implementation Plan (Analysis & Resources Modules)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the missing `analysis` and `resources` backend modules in NestJS (`apps/api`), enable CORS, implement deterministic scoring and gap engine according to AGENTS.md, and connect live with Frontend (`apps/web`).

**Architecture:** NestJS modular architecture with separate controller/service boundaries. Deterministic-first pipeline for CV analysis (text extraction -> entity validation -> rule-based scoring -> gap identification -> prioritized actions). In-memory + seed store for teacher resources with fast query filtering.

**Tech Stack:** NestJS 11, TypeScript 5, Express Multer, Class-Validator, Swagger (OpenAPI), Prisma.

**Spec:** [AGENTS.md](file:///c:/Users/LENOVO/source/repos/Skill-Lora/AGENTS.md) and [ROADMAP_GENERATOR_PLAN.md](file:///c:/Users/LENOVO/source/repos/Skill-Lora/ROADMAP_GENERATOR_PLAN.md)

## Global Constraints

- Strictly follow the **Critical AI Rule** in AGENTS.md: Never let LLM calculate scores, rank candidates, invent skills, or assign gap severity. All scores and gaps must be computed deterministically via backend rules and taxonomy configs.
- Never run automated `git commit` or `git push` commands (user manages commits manually).
- Ensure `npm run build:api` and `npm run build:web` pass with 0 errors.

---

### Task 1: Enable CORS & File Upload Support in Backend

**Files:**
- Modify: `apps/api/src/main.ts`

**Interfaces:**
- Produces: Global CORS policy allowing requests from `http://localhost:5173` with credentials.

- [x] **Step 1: Update `main.ts` to enable CORS**
Add `app.enableCors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true })` before `app.listen()`.

- [x] **Step 2: Verify build**
Run: `npm run build -w apps/api`

---

### Task 2: Build `ResourcesModule` (Teacher Learning Resources)

**Files:**
- Create: `apps/api/src/resources/dto/create-resource.dto.ts`
- Create: `apps/api/src/resources/dto/query-resource.dto.ts`
- Create: `apps/api/src/resources/config/seed-resources.config.ts`
- Create: `apps/api/src/resources/resources.service.ts`
- Create: `apps/api/src/resources/resources.controller.ts`
- Create: `apps/api/src/resources/resources.module.ts`
- Modify: `apps/api/src/app.module.ts`

**Interfaces:**
- Produces: `GET /api/resources` (filtering by `skill_tag`, `difficulty`, `type`) and `POST /api/resources` (creating learning materials).

- [x] **Step 1: Create Resource DTOs and Seed Config**
Define `CreateResourceDto` (with validation decorators) and `QueryResourceDto`. Create initial seed data containing the 8 curated resources mapped to skills (`NestJS`, `SQL`, `Docker`, `Pandas`, `PyTorch`...).

- [x] **Step 2: Implement `ResourcesService` and `ResourcesController`**
Implement methods `findAll(query: QueryResourceDto)` with keyword search and filter, and `create(dto: CreateResourceDto)`. Expose endpoints with Swagger annotations.

- [x] **Step 3: Register `ResourcesModule` in `app.module.ts`**
Import `ResourcesModule` into `AppModule`.

- [x] **Step 4: Verify build**
Run: `npm run build -w apps/api`

---

### Task 3: Build `AnalysisModule` (CV Upload & Deterministic Gap Engine)

**Files:**
- Create: `apps/api/src/analysis/dto/analyze-request.dto.ts`
- Create: `apps/api/src/analysis/dto/analysis-response.dto.ts`
- Create: `apps/api/src/analysis/config/role-requirements.config.ts`
- Create: `apps/api/src/analysis/engine/deterministic-scorer.ts`
- Create: `apps/api/src/analysis/engine/gap-engine.ts`
- Create: `apps/api/src/analysis/analysis.service.ts`
- Create: `apps/api/src/analysis/analysis.controller.ts`
- Create: `apps/api/src/analysis/analysis.module.ts`
- Modify: `apps/api/src/app.module.ts`

**Interfaces:**
- Produces: `POST /api/analyses` accepting `multipart/form-data` (`cv_file`, `transcript_file`, `target_role`, `jd_text`) and `GET /api/analyses/:id`.

- [x] **Step 1: Create `role-requirements.config.ts`**
Define baseline skill requirements, required core competencies, ATS keywords, and prerequisite academic courses for each role (`backend_developer`, `data_analyst`, `ai_engineer`).

- [x] **Step 2: Implement `deterministic-scorer.ts` and `gap-engine.ts`**
- `calculateScores(extractedSkills, roleConfig)`: Computes `readiness_score` (0-100), `match_percentage`, `ats_score`, and `academic_score`.
- `detectGaps(extractedSkills, roleConfig)`: Identifies missing skills, assigns severity (`high`, `medium`, `low`), target levels, and generates actionable prioritized steps.

- [x] **Step 3: Create Swagger DTOs (`analyze-request.dto.ts`, `analysis-response.dto.ts`)**
Ensure exact matching with frontend `analysis.types.ts` and `AGENTS.md` expected shape.

- [x] **Step 4: Implement `AnalysisController` and `AnalysisService`**
Use `FileFieldsInterceptor([ { name: 'cv_file', maxCount: 1 }, { name: 'transcript_file', maxCount: 1 } ])`. Parse uploaded files, run deterministic pipeline, store in-memory analysis record, and return structured analysis result.

- [x] **Step 5: Register `AnalysisModule` in `app.module.ts`**
Import `AnalysisModule` into `AppModule`.

- [x] **Step 6: Verify build**
Run: `npm run build -w apps/api`

---

### Task 4: Connect Frontend with Live Backend Endpoints

**Files:**
- Create: `apps/web/src/services/resources.service.ts`
- Modify: `apps/web/src/pages/ResourcesPage.tsx`
- Modify: `apps/web/src/services/analysis.service.ts`

**Interfaces:**
- Consumes: Live `POST /api/analyses`, `GET /api/resources`, `POST /api/resources`
- Removes hardcoded static arrays in favor of live server state with graceful fallback.

- [x] **Step 1: Create `resources.service.ts` in `apps/web`**
Implement `getResources(query)` and `createResource(payload)` calling `/api/resources`.

- [x] **Step 2: Update `ResourcesPage.tsx` to fetch from live API**
Fetch resources on mount and send new resources to `POST /api/resources`.

- [x] **Step 3: Update `analysis.service.ts`**
Ensure multipart form data sends cleanly to live `POST /api/analyses`.

- [x] **Step 4: Verify build for both projects**
Run: `npm run build:api` and `npm run build:web`

---

### Task 5: End-to-End Integration Verification

- [x] **Step 1: Verify Swagger docs**
Ensure Swagger UI at `http://localhost:3000/docs` includes `/api/analyses` and `/api/resources`.

- [x] **Step 2: Test complete user flow**
Upload CV -> receive live analysis -> click create roadmap -> receive 4-week lesson plan -> browse teacher resources. Tested via automated E2E test suite (`test/analyses-resources.e2e.ts`) with 16/16 tests passing.
