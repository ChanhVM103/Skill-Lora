# Skillora Backend Phases

This document is the backend execution roadmap for Skillora. Use it as the source of truth for what to build first, what is considered done, and how to report progress after each phase.

## Current Backend Goal

Build the backend for Skillora MVP: an AI Skill Gap Coach for students.

The backend must support:

- Uploading CV and optional transcript files.
- Selecting a target role.
- Returning a structured career readiness analysis.
- Storing analysis results in MongoDB.
- Managing teacher learning resources.
- Keeping scoring, validation, matching, and gap severity deterministic.

## Golden Rule

LLM is allowed only for extraction:

- Raw CV text to normalized CV JSON.
- Raw transcript text to normalized transcript JSON.

LLM must not:

- Score students.
- Calculate GPA or credits.
- Rank students.
- Decide readiness.
- Invent skills, awards, technologies, companies, dates, or metrics.
- Decide gap severity.
- Decide final prioritized actions.

All important decisions must be made by backend code, config, and deterministic rules.

## Progress Reporting Rule

After finishing any phase, report progress to the user using this format:

```txt
Backend progress update:
- Completed: Phase X - <phase name>
- Done items:
  - <item 1>
  - <item 2>
- Verified:
  - <test/check 1>
- Current phase: Phase Y - <phase name>
- Next step:
  - <next concrete task>
```

If a phase is only partially done, report:

```txt
Backend progress update:
- Current phase: Phase X - <phase name>
- Completed in this phase:
  - <item 1>
- Remaining in this phase:
  - <item 1>
- Blockers:
  - <blocker or "none">
```

## Phase 0 - Backend Foundation

Goal: Make sure the backend project is ready for feature work.

Tasks:

- Confirm `apps/api` exists and runs.
- Confirm NestJS app starts locally.
- Confirm Swagger is configured.
- Confirm environment config pattern exists.
- Add or verify `.env` support.
- Add base health endpoint if missing.

Suggested endpoint:

```http
GET /health
```

Done when:

- API starts without runtime errors.
- Swagger page is reachable.
- Health endpoint returns a simple status.

Report as:

```txt
Completed: Phase 0 - Backend Foundation
Current phase: Phase 1 - MongoDB Setup
```

## Phase 1 - MongoDB Setup

Goal: Connect NestJS backend to MongoDB and prepare persistence for MVP.

Tasks:

- Install/configure NestJS Mongoose if not already present.
- Add MongoDB connection config.
- Add environment variables:
  - `MONGODB_URI`
  - `PORT`
  - optional `APP_ENV`
- Create database connection module or config inside `AppModule`.
- Verify the app can connect to MongoDB.

Done when:

- API starts and connects to MongoDB.
- Connection errors are visible and understandable.
- `.env.example` documents required variables.

Report as:

```txt
Completed: Phase 1 - MongoDB Setup
Current phase: Phase 2 - Analysis API Contract
```

## Phase 2 - Analysis API Contract

Goal: Create the first important backend API contract.

Endpoint:

```http
POST /analyses
```

Input:

```txt
multipart/form-data
```

Fields:

- `cv_file`: required file.
- `transcript_file`: optional file.
- `target_role`: required enum.
- `jd_text`: optional string.

Allowed target roles:

- `data_analyst`
- `backend_developer`
- `ai_engineer`

Tasks:

- Create `AnalysisModule`.
- Create `AnalysisController`.
- Create `AnalysisService`.
- Create request DTOs.
- Create response DTOs.
- Configure Swagger file upload correctly.
- Return a structured mock response.

Done when:

- Swagger shows `POST /analyses`.
- Swagger allows uploading CV and optional transcript.
- Endpoint returns a structured response even before real parsing.

Report as:

```txt
Completed: Phase 2 - Analysis API Contract
Current phase: Phase 3 - Analysis Persistence
```

## Phase 3 - Analysis Persistence

Goal: Store each analysis request and response in MongoDB.

Collection:

```txt
analyses
```

Minimum fields:

- `target_role`
- `jd_text`
- `status`
- `input_files`
- `parsed_cv`
- `parsed_transcript`
- `extraction_quality`
- `scores`
- `ats_checks`
- `academic_checks`
- `role_match`
- `evidence_ledger`
- `gap_items`
- `prioritized_actions`
- `recommended_resources`
- `metadata`
- `created_at`
- `updated_at`

Tasks:

- Create `Analysis` Mongoose schema.
- Save uploaded file metadata.
- Save mock structured analysis response.
- Return `analysis_id` from MongoDB.
- Add endpoint to fetch one analysis by ID.

Suggested endpoint:

```http
GET /analyses/:id
```

Done when:

- `POST /analyses` creates a MongoDB document.
- Response contains real `analysis_id`.
- `GET /analyses/:id` returns stored result.

Report as:

```txt
Completed: Phase 3 - Analysis Persistence
Current phase: Phase 4 - Resource Management
```

## Phase 4 - Resource Management

Goal: Allow teachers to create and manage learning resources.

Collection:

```txt
resources
```

Resource fields:

- `title`
- `type`
- `skill_tags`
- `difficulty`
- `url`
- `content`
- `created_by`
- `created_at`
- `updated_at`

Resource type examples:

- `lecture`
- `assignment`
- `article`
- `video`
- `project`
- `quiz`

Difficulty examples:

- `beginner`
- `intermediate`
- `advanced`

Tasks:

- Create `ResourcesModule`.
- Create resource schema.
- Create resource DTOs.
- Add CRUD endpoints.
- Add Swagger documentation.

Suggested endpoints:

```http
POST /resources
GET /resources
GET /resources/:id
PATCH /resources/:id
DELETE /resources/:id
```

Done when:

- Teacher resources can be created.
- Resources can be listed and filtered by skill tag.
- Swagger documents all resource endpoints.

Report as:

```txt
Completed: Phase 4 - Resource Management
Current phase: Phase 5 - Mock Recommendation
```

## Phase 5 - Mock Recommendation

Goal: Recommend teacher resources based on missing skills in mock gap items.

Tasks:

- Add missing skill tags to mock `gap_items`.
- Query resources by `skill_tags`.
- Attach matching resources to `recommended_resources`.
- Keep recommendation deterministic.

Recommendation rule for MVP:

```txt
If gap_items.skill_or_subject matches resources.skill_tags, recommend those resources.
Prefer beginner/intermediate resources for missing or partial skills.
```

Done when:

- `POST /analyses` returns recommended resources from MongoDB.
- No LLM is used for recommendation.

Report as:

```txt
Completed: Phase 5 - Mock Recommendation
Current phase: Phase 6 - Ingestion Skeleton
```

## Phase 6 - Ingestion Skeleton

Goal: Prepare file handling and text extraction boundaries.

Modules:

- `ingestion`
- `extraction`

Tasks:

- Create `IngestionModule`.
- Create file type validation service.
- Accept supported file types:
  - PDF
  - DOCX
  - image
- Store file metadata.
- Add placeholder text extraction service.
- Add extraction quality DTO.
- Add early fail response shape for low-quality text.

Done when:

- Unsupported file types are rejected.
- Supported files pass into the analysis pipeline.
- Text extraction service interface exists.
- Mock text quality checks exist.

Report as:

```txt
Completed: Phase 6 - Ingestion Skeleton
Current phase: Phase 7 - Deterministic Validation
```

## Phase 7 - Deterministic Validation

Goal: Add code-based checks for CV and transcript quality.

CV validation checks:

- Contact exists.
- Email format.
- Phone format if present.
- Skills section exists.
- Education exists.
- Experience or projects exist.
- Dates are plausible.
- Repetition is not excessive.
- Text length is reasonable.

Transcript validation checks:

- GPA/CPA format is valid.
- Grading scale is valid.
- Subjects exist.
- Credits are valid numbers.
- Grades are within scale.
- Semesters are plausible.
- Missing data is flagged.

Done when:

- `ats_checks` are generated by code.
- `academic_checks` are generated by code.
- The backend does not trust LLM-calculated GPA, credits, or ranking.

Report as:

```txt
Completed: Phase 7 - Deterministic Validation
Current phase: Phase 8 - Scoring Config
```

## Phase 8 - Scoring Config

Goal: Compute readiness scores using versioned config.

Create versioned config:

```txt
scoring-v1
```

CV score dimensions:

- ATS/readability.
- Impact/action verbs.
- Skill relevance.
- Experience/project clarity.
- Education/learning.

Transcript score dimensions:

- GPA/academic strength.
- Relevant coursework.
- Consistency/trend by semester.
- Foundational subjects.
- Missing/weak subjects.

Tasks:

- Create scoring config file.
- Create `ScoringModule`.
- Compute dimension scores.
- Compute overall readiness from weighted formula.
- Return `scoring_weight_version`.

Done when:

- Scores are deterministic.
- Weights are not scattered across random files.
- Response includes dimension scores and config version.

Report as:

```txt
Completed: Phase 8 - Scoring Config
Current phase: Phase 9 - Role Matching
```

## Phase 9 - Role Matching

Goal: Match student profile against target role or custom JD.

Tasks:

- Create role requirement config for:
  - Data Analyst
  - Backend Developer
  - AI Engineer
- Create skill taxonomy config.
- Normalize extracted skills and coursework.
- Classify items as:
  - `matched`
  - `partial`
  - `missing`
  - `bonus`
- Ensure missing required skills cannot be fully offset by bonus skills.

Done when:

- `role_match` is generated by backend rules.
- Required and preferred skills are treated differently.
- Custom `jd_text` can be accepted, even if initial handling is simple.

Report as:

```txt
Completed: Phase 9 - Role Matching
Current phase: Phase 10 - Gap Engine
```

## Phase 10 - Gap Engine

Goal: Generate standard `gap_items` from CV, transcript, role rubric, and JD match.

Gap item fields:

- `source`
- `type`
- `status`
- `skill_or_subject`
- `evidence_refs`
- `severity`
- `fixability`
- `recommended_next_action`

Severity inputs:

- Importance.
- Gap size.
- Evidence risk.
- Market or JD demand.

Fixability rules:

- Missing skill: `learn`.
- Skill with weak evidence: `add_evidence`.
- Existing evidence written poorly: `rewrite`.
- Weak or failed subject: `retake_or_improve`.
- Historical fact that cannot be changed now: `not_fixable_now`.

Done when:

- `gap_items` are deterministic.
- Missing skills are not turned into rewrite suggestions.
- Actions are backed by evidence.

Report as:

```txt
Completed: Phase 10 - Gap Engine
Current phase: Phase 11 - LLM Extraction Integration
```

## Phase 11 - LLM Extraction Integration

Goal: Add LLM extraction only after the deterministic pipeline shape is stable.

Tasks:

- Create prompt versions.
- Create CV extraction prompt.
- Create transcript extraction prompt.
- Validate LLM output against schemas.
- Reject or flag low-confidence extraction.
- Store prompt version, model, latency, and token usage.

Done when:

- LLM output is schema-validated.
- LLM cannot decide scoring or gaps.
- Response metadata includes model and prompt version.

Report as:

```txt
Completed: Phase 11 - LLM Extraction Integration
Current phase: Phase 12 - Parser/OCR Integration
```

## Phase 12 - Parser/OCR Integration

Goal: Add real text extraction from uploaded documents.

Tasks:

- Extract text from PDF.
- Extract text from DOCX.
- Extract text from images.
- Use OCR fallback for scanned PDFs/images.
- Add text quality check before LLM extraction.
- Fail early for empty or noisy text.

Done when:

- PDF/DOCX/image inputs produce raw text.
- OCR fallback works for scan-like files.
- Low-quality text does not get sent to LLM.

Report as:

```txt
Completed: Phase 12 - Parser/OCR Integration
Current phase: Phase 13 - Test and Eval Cases
```

## Phase 13 - Test and Eval Cases

Goal: Protect the deterministic behavior with tests.

Required test/eval cases:

- CV text is good and transcript is missing.
- CV PDF scan requires OCR fallback.
- Empty/noisy CV fails early.
- Skill exists with clear evidence.
- Claimed skill has no evidence and becomes `unproven`.
- Transcript GPA is parsed but backend recalculates or validates it.
- Missing SQL for Data Analyst becomes a high-severity gap.
- Missing Statistics coursework becomes a coursework gap.
- Bonus skills do not hide missing required skills.
- Resource recommendation matches missing skill tags.
- Rewrite suggestion only appears when evidence exists.
- System does not invent awards, ranking, dates, company names, or metrics.
- Response includes trace id, prompt version, scoring weight version, extraction quality, latency, and token usage when available.

Done when:

- Main deterministic services have unit tests.
- API has at least one integration/e2e test for `POST /analyses`.
- Test cases cover anti-fabrication rules.

Report as:

```txt
Completed: Phase 13 - Test and Eval Cases
Current phase: MVP backend ready for integration
```

## Recommended Build Order

For the hackathon MVP, do the phases in this order:

1. Phase 0 - Backend Foundation
2. Phase 1 - MongoDB Setup
3. Phase 2 - Analysis API Contract
4. Phase 3 - Analysis Persistence
5. Phase 4 - Resource Management
6. Phase 5 - Mock Recommendation
7. Phase 6 - Ingestion Skeleton
8. Phase 7 - Deterministic Validation
9. Phase 8 - Scoring Config
10. Phase 9 - Role Matching
11. Phase 10 - Gap Engine
12. Phase 13 - Test and Eval Cases

Only do these after the core demo works:

- Phase 11 - LLM Extraction Integration
- Phase 12 - Parser/OCR Integration

## MVP Backend Completion Definition

The backend MVP is ready when:

- Swagger documents all MVP endpoints.
- `POST /analyses` accepts files and target role.
- Analysis results are saved in MongoDB.
- Teacher resources can be created and listed.
- Missing skills can recommend matching resources.
- Scoring and gap generation are deterministic.
- The response is structured enough for frontend integration.
- Anti-fabrication rules are respected.

