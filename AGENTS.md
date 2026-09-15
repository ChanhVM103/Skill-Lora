# Skillora Agent Guide

## Project Overview

Skillora is an MVP hackathon product for **Track 1 - Future Skills Readiness**.

The product is an **AI Skill Gap Coach for students**. Students upload a CV and optionally a transcript, choose a target career role, and receive a structured readiness analysis showing current skills, missing skills, gap severity, prioritized learning actions, and a learning roadmap based on teacher-provided resources.

The first MVP should prioritize a working end-to-end flow, clear API contracts, Swagger documentation, and structured mock responses. Real AI integration can come later.

## MVP Product Scope

The MVP is a web app with two main flows:

### Student Flow

Students should be able to:

- Upload a CV file.
- Optionally upload a transcript file.
- Select a target role:
  - Data Analyst
  - Backend Developer
  - AI Engineer
- Optionally provide a custom job description text.
- Click Analyze.
- View a structured result containing:
  - Extracted CV information.
  - Extracted transcript information.
  - Existing skills.
  - Missing skills or academic gaps.
  - Readiness score.
  - Gap items.
  - Prioritized actions.
  - Learning roadmap.
  - Recommended teacher resources.

### Teacher / Resource Flow

Teachers should be able to create learning resources.

Each resource should include:

- Title.
- Type, such as lecture, assignment, article, video, project, or quiz.
- Skill tags.
- Difficulty.
- URL or content.

When a student is missing a skill, the system should recommend matching resources based on skill tags and difficulty.

## Architecture

This project is a monorepo named `skillora`.

Expected structure:

- `apps/api`: NestJS backend.
- `apps/web`: React + TypeScript frontend.

The backend should be designed as **deterministic-first**.

## Critical AI Rule

AI/LLM must only be used for extraction tasks, such as converting raw CV or transcript text into normalized JSON.

Do not let the LLM:

- Grade students.
- Calculate GPA.
- Rank candidates.
- Decide readiness scores.
- Invent skills without evidence.
- Create gap severity.
- Decide final role matching.
- Decide prioritized actions.

These must be handled by backend rules, configuration, validation logic, and deterministic scoring.

## Analysis Pipeline

The intended backend pipeline is:

1. Upload CV and optional transcript.
2. Extract text from uploaded files.
3. Run text quality checks.
4. Use LLM extraction to produce normalized JSON only if needed.
5. Run deterministic validation.
6. Run deterministic scoring.
7. Match against role requirements or custom JD.
8. Run gap engine.
9. Generate prioritized learning actions.
10. Recommend matching teacher resources.
11. Return structured analysis response.

## Backend Modules

Preferred backend module boundaries:

- `analysis`: Orchestrates analysis requests and response assembly.
- `ingestion`: Handles file upload, file type checks, and raw text extraction.
- `extraction`: Converts extracted text into normalized structured JSON.
- `validation`: Validates extracted entities and evidence.
- `scoring`: Computes readiness and supporting scores deterministically.
- `matching`: Compares student profile against target role requirements or JD text.
- `gap-engine`: Produces gap items, severity, and learning needs.
- `resources`: Manages teacher resources and recommends resources for missing skills.

Keep responsibilities separated. Avoid placing scoring, matching, and extraction logic directly inside controllers.

## Priority API

Implement this endpoint first:

```http
POST /analyses
```

Input type:

```txt
multipart/form-data
```

Fields:

- `cv_file`: required file.
- `transcript_file`: optional file.
- `target_role`: required string. Allowed MVP values:
  - `data_analyst`
  - `backend_developer`
  - `ai_engineer`
- `jd_text`: optional string.

The initial implementation can return a mock structured response. It must still accept file upload and expose clear Swagger documentation.

## Expected Analysis Response Shape

The initial mock response should include:

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

Use stable DTOs and predictable field names so the frontend can integrate before real extraction/scoring is complete.

## Frontend MVP Screens

The frontend should focus on four screens:

1. Upload and Analyze
2. Analysis Result
3. Learning Roadmap
4. Teacher Resources

Avoid building broad social, payment, marketplace, or certification features in the MVP.

## Implementation Principles

- Prefer small, typed DTOs and explicit enums.
- Keep Swagger accurate and useful.
- Return structured mock data before real AI integration.
- Keep scoring and matching explainable.
- Always preserve evidence for extracted skills or academic signals.
- Do not silently fabricate student abilities.
- Keep role requirements in backend config or seed data.
- Make the API easy for the frontend to consume.
- Build the simplest useful end-to-end demo first.

## MVP Demo Goal

The demo should show this story clearly:

Student uploads CV/transcript, selects a career target, receives a career readiness report, sees skill gaps, and gets a practical roadmap with teacher-curated resources.

Short pitch:

> Skillora helps students turn their CV and transcript into a personalized career readiness report, showing skill gaps, readiness score, and a practical learning roadmap powered by teacher-curated resources.

## What Not To Build First

Do not prioritize these before the core MVP works:

- Real payment.
- Large marketplace.
- Complex authentication or authorization.
- Full LMS.
- Video calls or mentoring.
- Advanced analytics dashboards.
- Ranking students against each other.
- Fully autonomous AI grading.

## Agent Checklist

Before making changes, confirm which layer is being touched:

- Backend API contract.
- Backend pipeline logic.
- Mock response data.
- Frontend upload flow.
- Frontend result display.
- Resource management.
- Documentation.

When implementing backend work, prefer this order:

1. DTOs and Swagger.
2. Controller endpoint.
3. Service orchestration.
4. Mock structured response.
5. Deterministic rule/config logic.
6. Real extraction integrations.

When implementing frontend work, prefer this order:

1. File upload form.
2. Target role selector.
3. API integration.
4. Result sections.
5. Roadmap display.
6. Resource recommendations.

