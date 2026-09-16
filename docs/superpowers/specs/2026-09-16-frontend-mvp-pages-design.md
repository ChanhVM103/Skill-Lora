# Skillora Frontend MVP Pages Design Specification

**Date:** 2026-09-16  
**Status:** Approved  
**Author:** Pair programming with User  

---

## 1. Overview & Goals

Skillora is an AI Skill Gap Coach for students. The frontend application (`apps/web`) provides a sleek, responsive, and intuitive web experience covering the two primary user flows:
1. **Student Flow:** Upload CV and transcript, choose career role, inspect skill readiness and gaps, and view a structured 4-week learning roadmap.
2. **Teacher / Resource Flow:** Browse educational resources (lectures, assignments, quizzes, labs) mapped to skills, and add new resources.

The MVP prioritizes high aesthetic quality (Rich Aesthetics: dark mode, glassmorphism, glowing accents, smooth transitions), predictable state, and type-safe integration with the NestJS backend (`apps/api`).

---

## 2. Tech Stack & Architecture

- **Core:** React 19, TypeScript 6, Vite 8.
- **Routing:** `react-router-dom` (v7) for clean client-side routes.
- **Styling:** Modern Vanilla CSS Design System (`src/index.css`) featuring custom CSS variables, glassmorphic cards (`backdrop-filter: blur`), responsive CSS grid/flexbox, modern typography (Inter / Outfit style font stack).
- **Icons:** SVG icons embedded or reusable feather-like SVG icon components (no heavy external icon bundle).
- **HTTP / API Client:** Centralized `src/services/api-client.ts` with Vite dev proxy (`/api` -> `http://localhost:3000`), error handling, and mock fallback capabilities for offline/demo scenarios.

---

## 3. Application Structure

```
apps/web/src/
├── assets/                  # Logos and imagery
├── types/
│   ├── roadmap.types.ts     # DTO types matching apps/api/src/roadmap/dto/
│   ├── analysis.types.ts    # DTO types for CV analysis & skill gaps
│   └── auth.types.ts        # DTO types for Auth and Profile
├── services/
│   ├── api-client.ts        # Axios/Fetch client with interceptors
│   ├── roadmap.service.ts   # Calls POST /api/roadmaps/generate
│   ├── analysis.service.ts  # Calls POST /api/analyses (with mock fallback)
│   └── auth.service.ts      # Calls /api/auth/* & /api/profile/*
├── context/
│   └── AuthContext.tsx      # Simple session & token state
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Top navigation, branding, active route, Auth button
│   │   └── Footer.tsx       # Standard brand footer with sitemap links
│   ├── common/
│   │   ├── Badge.tsx        # Severity & status tags (high, medium, low, missing)
│   │   ├── Button.tsx       # Primary gradient, secondary ghost, loading state
│   │   ├── Card.tsx         # Glassmorphic container with glow borders
│   │   └── Modal.tsx        # Accessible dialog backdrop
│   └── auth/
│       └── AuthModal.tsx    # Login & Register modal dialog
├── pages/
│   ├── AnalyzePage.tsx      # [Screen 1] Upload CV/Transcript, Role Selector, JD Input
│   ├── ResultPage.tsx       # [Screen 2] Readiness Score, Gap Items, Prioritized Actions
│   ├── RoadmapPage.tsx      # [Screen 3] 4-Week Phase Timeline, Steps, Projects, Resources
│   ├── ResourcesPage.tsx    # [Screen 4] Teacher Resource directory, filter & add modal
│   └── ProfilePage.tsx      # [Screen 5] User profile overview & settings
├── App.tsx                  # Router provider & page layout shell
├── index.css                # Global design system tokens & utilities
└── main.tsx                 # React entry point
```

---

## 4. Detailed Screen Specifications

### 4.1 Navigation Bar (`Navbar.tsx`)
- **Logo:** Skillora brand icon with glowing violet/cyan gradient text.
- **Nav Links:**
  - `Phân Tích CV` (`/` or `/analyze`)
  - `Lộ Trình Học` (`/roadmap`)
  - `Kho Tài Nguyên` (`/resources`)
- **Action Area:**
  - When unauthenticated: "Đăng Nhập" / "Đăng Ký" button triggering `AuthModal`.
  - When authenticated: User avatar badge, full name, and dropdown (Profile, Logout).

### 4.2 Screen 1: Upload & Analyze (`AnalyzePage.tsx`)
- **Hero Title:** "AI Skill Gap Coach Cho Sinh Viên Công Nghệ".
- **Target Role Selection:** 3 primary interactive role cards:
  - `data_analyst` (Data Analyst)
  - `backend_developer` (Backend Developer)
  - `ai_engineer` (AI Engineer)
- **Dropzone Area:**
  - File input for CV (`.pdf`, `.docx`) - Required.
  - File input for Bảng điểm (`.pdf`, `.png`, `.jpg`) - Optional.
- **Custom JD Textarea:** Collapsible accordion for entering specific job description requirements.
- **Submission:** Visual loading scanner indicator with realistic steps ("Đang đọc CV...", "So khớp kỹ năng...", "Tính điểm sẵn sàng...") transitioning to `/result`.

### 4.3 Screen 2: Analysis Result (`ResultPage.tsx`)
- **Readiness Score Card:** Circular or radial progress gauge showing overall career readiness (e.g. 68/100, Tier: "Gần đạt chuẩn").
- **Skill Breakdown Matrix:**
  - Existing Skills extracted with evidence (green badges).
  - Missing Skills / Gap Items categorized by severity (`High` - Red, `Medium` - Amber, `Low` - Blue).
- **Academic & ATS Feedback:** Practical bullet points checking resume format and academic prerequisites.
- **Prioritized Action Plan:** 3-5 prioritized recommendations.
- **Bridge to Roadmap:** Prominent CTA button: "Tạo Lộ Trình Học 4 Tuần Để Bù Đắp Khoảng Trống", passing gap items directly into the Roadmap generator.

### 4.4 Screen 3: Learning Roadmap (`RoadmapPage.tsx`)
- **Role & Summary Banner:** Target role, estimated total hours (e.g. 80 hrs), starting level.
- **Interactive Sandbox Selector:** Allows user to test the real backend `POST /api/roadmaps/generate` on-demand with different roles and sample gap sets.
- **4-Phase Timeline Display:**
  - Phase 1: Nền tảng (Foundation & Setup)
  - Phase 2: Kỹ năng cốt lõi (Core Engineering)
  - Phase 3: Kiến trúc & Tối ưu (System & Optimization)
  - Phase 4: Dự án Capstone Portfolio (Portfolio Project)
- **Phase Items:**
  - Phase title, objective, and week range.
  - Granular learning steps with hours and difficulty badges.
  - Practical project specification with deliverables.
  - Curated Teacher Resources attached to steps.
  - Resource Gap Alert (visual amber banner when a skill lacks teacher materials).

### 4.5 Screen 4: Teacher Resources (`ResourcesPage.tsx`)
- **Search & Filter:** Keyword search, filter chips for Skill Tags (SQL, Docker, NestJS, Python...), Difficulty (`Beginner`, `Intermediate`, `Advanced`), and Resource Type (`Lecture`, `Assignment`, `Project`, `Quiz`, `Video`).
- **Resource Grid:** Cards with direct external links, difficulty indicator, and teacher contributor attribution.
- **Contribute Resource Modal:** Form allowing teachers to submit new learning resources.

### 4.6 Screen 5: Profile & Auth (`ProfilePage.tsx` & `AuthModal.tsx`)
- Clean modal with tabs for Login (`/api/auth/login`) and Register (`/api/auth/register`).
- Profile page showing user details, avatar, current target role, and account role (`student` / `teacher`).

---

## 5. Visual Design System

- **Background:** Rich Dark Obsidian (`#0b0f19` to `#111827`) with subtle radial gradients.
- **Accents:** Neon Indigo (`#6366f1`), Electric Violet (`#8b5cf6`), and Emerald Green (`#10b981`).
- **Cards:** Glassmorphic translucent cards with `rgba(255, 255, 255, 0.04)` background, subtle 1px border (`rgba(255, 255, 255, 0.08)`), and soft drop shadows.
- **Typography:** Modern clean sans-serif font stack with clear hierarchy, high contrast, and comfortable reading line-height.
