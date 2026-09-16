# Frontend MVP Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all missing frontend MVP screens, routing, glassmorphic design system, and API integration for the Skillora web application.

**Architecture:** Client-side SPA using React 19, Vite, and React Router v7. Modern Vanilla CSS design system with dark obsidian glassmorphism. Centralized API client layer communicating with NestJS backend via Vite dev proxy and graceful mock fallbacks.

**Tech Stack:** React 19, TypeScript 6, Vite 8, React Router v7, Axios, Vanilla CSS (CSS variables, backdrop-filter blur).

**Spec:** [docs/superpowers/specs/2026-09-16-frontend-mvp-pages-design.md](file:///c:/Users/LENOVO/source/repos/Skill-Lora/docs/superpowers/specs/2026-09-16-frontend-mvp-pages-design.md)

## Global Constraints

- Never run automated `git commit` or `git push` commands (user manages commits manually).
- Maintain type-safety and ensure `npm run build -w apps/web` passes without errors.
- Keep UI aesthetically rich (vibrant neon accents, dark glassmorphism, responsive cards, micro-interactions).
- Zero placeholders (all mock data and real API contracts must be complete and realistic).

---

### Task 1: Foundation Setup - Dependencies, Design Tokens & Base UI Components

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/src/index.css`
- Create: `apps/web/src/components/common/Button.tsx`
- Create: `apps/web/src/components/common/Badge.tsx`
- Create: `apps/web/src/components/common/Card.tsx`
- Create: `apps/web/src/components/common/Modal.tsx`

**Interfaces:**
- Produces: `Button`, `Badge`, `Card`, `Modal` reusable UI primitives.

- [ ] **Step 1: Install `react-router-dom` and `axios` in `apps/web`**
Run:
```bash
npm install react-router-dom axios -w apps/web
```

- [ ] **Step 2: Update `apps/web/src/index.css` with Design System Tokens**
Configure color variables (`--bg-primary: #0b0f19`, `--card-bg: rgba(17, 24, 39, 0.75)`, `--border-glow: rgba(99, 102, 241, 0.25)`, `--accent-indigo: #6366f1`, `--accent-violet: #8b5cf6`, `--accent-emerald: #10b981`), typography, scrollbar styling, and glassmorphism helpers.

- [ ] **Step 3: Implement `Button`, `Badge`, `Card`, and `Modal` components**
Create clean TypeScript components with variant styling (`primary`, `secondary`, `outline`, `danger`), loading spinners, and severity colors (`high`, `medium`, `low`).

- [ ] **Step 4: Verify build succeeds**
Run: `npm run build -w apps/web`

---

### Task 2: Network & DTO Layer (API Client, Types & Services)

**Files:**
- Modify: `apps/web/vite.config.ts`
- Create: `apps/web/src/types/roadmap.types.ts`
- Create: `apps/web/src/types/analysis.types.ts`
- Create: `apps/web/src/types/auth.types.ts`
- Create: `apps/web/src/services/api-client.ts`
- Create: `apps/web/src/services/roadmap.service.ts`
- Create: `apps/web/src/services/analysis.service.ts`
- Create: `apps/web/src/services/auth.service.ts`

**Interfaces:**
- Consumes: Backend DTO contracts from `apps/api/src/roadmap/dto/` and `apps/api/src/modules-api/`
- Produces: `roadmapService.generateRoadmap()`, `analysisService.analyzeCV()`, `authService.login()`, `authService.getProfile()`

- [ ] **Step 1: Configure Vite Proxy in `apps/web/vite.config.ts`**
Proxy `/api` requests to `http://localhost:3000` with `changeOrigin: true`.

- [ ] **Step 2: Define TypeScript DTOs**
Mirror `GenerateRoadmapRequestDto`, `RoadmapResponseDto`, `AnalysisResponseDto`, `UserDto`, and `AuthResponseDto`.

- [ ] **Step 3: Create `api-client.ts` with Interceptor**
Axios instance with base URL `/api`, bearer token injection from localStorage, and standardized error parsing.

- [ ] **Step 4: Implement Service modules**
Implement `roadmapService` (calling `/api/roadmaps/generate`), `analysisService` (calling `/api/analyses` with comprehensive fallback mock data), and `authService`.

- [ ] **Step 5: Verify build**
Run: `npm run build -w apps/web`

---

### Task 3: Layout Shell, Navigation & Auth Modal

**Files:**
- Create: `apps/web/src/context/AuthContext.tsx`
- Create: `apps/web/src/components/layout/Navbar.tsx`
- Create: `apps/web/src/components/layout/Footer.tsx`
- Create: `apps/web/src/components/auth/AuthModal.tsx`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- Produces: Persistent navigation, routing framework, active links, auth session provider.

- [ ] **Step 1: Create `AuthContext.tsx`**
Manage `user`, `token`, `login()`, `logout()`, and `isAuthenticated` state with persistence in `localStorage`.

- [ ] **Step 2: Create `Navbar.tsx` & `Footer.tsx`**
Responsive header with Skillora glowing brand, route links (`/`, `/roadmap`, `/resources`), and user avatar/login button.

- [ ] **Step 3: Create `AuthModal.tsx`**
Tabbed dialog for Login & Register connected to `authService`.

- [ ] **Step 4: Wire routing in `App.tsx`**
Set up `BrowserRouter`, `Routes`, and define route placeholders for pages.

- [ ] **Step 5: Verify build**
Run: `npm run build -w apps/web`

---

### Task 4: Learning Roadmap Screen (`RoadmapPage.tsx`)

**Files:**
- Create: `apps/web/src/pages/RoadmapPage.tsx`
- Create: `apps/web/src/components/roadmap/PhaseTimeline.tsx`
- Create: `apps/web/src/components/roadmap/ResourceGapAlert.tsx`

**Interfaces:**
- Consumes: `roadmapService.generateRoadmap()`
- Produces: Interactive 4-week learning roadmap connected to real NestJS backend endpoint `POST /api/roadmaps/generate`.

- [ ] **Step 1: Create `PhaseTimeline.tsx`**
Renders 4 weekly phases, collapsible step details, estimated study hours, practical project badge, and attached teacher resources.

- [ ] **Step 2: Create `ResourceGapAlert.tsx`**
Renders amber alert box showing skills where no teacher resource was found, with self-study guidance.

- [ ] **Step 3: Implement `RoadmapPage.tsx`**
Include Sandbox Selector (choose `backend_developer`, `data_analyst`, `ai_engineer`, toggle sample gap items), "Tạo Lộ Trình Mới" button, loading skeleton, and full timeline render.

- [ ] **Step 4: Verify build**
Run: `npm run build -w apps/web`

---

### Task 5: CV Upload & Analyze Screen (`AnalyzePage.tsx`)

**Files:**
- Create: `apps/web/src/pages/AnalyzePage.tsx`
- Create: `apps/web/src/components/analyze/FileDropzone.tsx`
- Create: `apps/web/src/components/analyze/RoleSelector.tsx`

**Interfaces:**
- Produces: Primary student entry screen, file upload handling, role selection, and transition to `/result`.

- [ ] **Step 1: Create `RoleSelector.tsx`**
Interactive role selector cards for Data Analyst, Backend Developer, and AI Engineer with key tech badges.

- [ ] **Step 2: Create `FileDropzone.tsx`**
Drag-and-drop file upload with format verification (`.pdf`, `.docx`), file size display, and remove file action.

- [ ] **Step 3: Implement `AnalyzePage.tsx`**
Hero section, role picker, required CV dropzone, optional transcript dropzone, optional custom JD accordion, and multi-stage analysis scanner animation leading to `/result`.

- [ ] **Step 4: Verify build**
Run: `npm run build -w apps/web`

---

### Task 6: Skill Gap Analysis Result Screen (`ResultPage.tsx`)

**Files:**
- Create: `apps/web/src/pages/ResultPage.tsx`
- Create: `apps/web/src/components/result/ReadinessScoreGauge.tsx`
- Create: `apps/web/src/components/result/SkillComparisonTable.tsx`

**Interfaces:**
- Consumes: Analysis result from state or mock data
- Produces: In-depth career readiness report and direct handoff button to `RoadmapPage`.

- [ ] **Step 1: Create `ReadinessScoreGauge.tsx`**
Radial score gauge with animated ring (e.g. 72/100), level classification badge, and percentile comparison.

- [ ] **Step 2: Create `SkillComparisonTable.tsx`**
Dual-column layout: Extracted skills with evidence tags vs Missing skills categorized by High/Med/Low severity.

- [ ] **Step 3: Implement `ResultPage.tsx`**
Include score gauge, ATS resume health check, academic prerequisite signals, prioritized action items, and "Xem Lộ Trình 4 Tuần" CTA.

- [ ] **Step 4: Verify build**
Run: `npm run build -w apps/web`

---

### Task 7: Teacher Resources & Profile Screens

**Files:**
- Create: `apps/web/src/pages/ResourcesPage.tsx`
- Create: `apps/web/src/components/resources/ResourceCard.tsx`
- Create: `apps/web/src/components/resources/AddResourceModal.tsx`
- Create: `apps/web/src/pages/ProfilePage.tsx`

**Interfaces:**
- Produces: Teacher resource hub, filtering, new resource creation form, and user profile management screen.

- [ ] **Step 1: Create `ResourceCard.tsx` & `AddResourceModal.tsx`**
Displays resource type icon (video, lab, lecture, assignment), skill tags, difficulty level, and external link. Modal allows adding new materials.

- [ ] **Step 2: Implement `ResourcesPage.tsx`**
Filter bar (Search, Skill tag chips, Difficulty dropdown, Type dropdown), responsive grid of resources, and "Đóng góp tài liệu" button.

- [ ] **Step 3: Implement `ProfilePage.tsx`**
Profile header with user avatar, name, email, target role selector, and career readiness summary.

- [ ] **Step 4: Verify build**
Run: `npm run build -w apps/web`

---

### Task 8: End-to-End Integration & Polish

**Files:**
- Check all routes and components across `apps/web/src`
- Polish micro-animations, transitions, responsive breakpoints

- [ ] **Step 1: Run full production build**
Run: `npm run build -w apps/web`
Verify 0 errors, 0 warnings.

- [ ] **Step 2: Test dev server startup**
Ensure dev server starts cleanly with `npm run dev:web`.
