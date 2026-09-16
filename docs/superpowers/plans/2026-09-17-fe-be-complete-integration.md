# Kế Hoạch Bổ Sung Frontend & Kết Nối Toàn Diện 100% API Backend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng toàn bộ các màn hình và tính năng Frontend còn thiếu để kết nối và tận dụng 100% các endpoint API của Backend (`apps/api`), bao gồm: Trang Quản trị Admin (CRUD Users), Modal Giáo viên Thêm Tài Nguyên Học Tập (`POST /api/resources`), Modal Thông Tin Cá Nhân & Đổi Mật Khẩu & Upload Avatar Cloudinary (`/api/profile`, `/api/auth/change-password`), Tải lại Phân Tích Cũ theo ID (`GET /api/analyses/:id`), và Bổ sung Bảng Điểm & Custom JD cho bộ quét CV.

**Architecture:** Mở rộng client-side Single Page Application trong `apps/web` (React 19 + TypeScript + Tailwind CSS). Sử dụng kiến trúc module phân tầng: Services Layer (`api-client`), DTO Types, State Management, và Reusable UI Components.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Axios, NestJS 12.

**Spec:** [docs/superpowers/specs/2026-09-16-frontend-mvp-pages-design.md](file:///c:/Users/LENOVO/source/repos/Skill-Lora/docs/superpowers/specs/2026-09-16-frontend-mvp-pages-design.md)

## Global Constraints
- Không sửa mã nguồn Backend (`apps/api`) - mọi API đã sẵn sàng.
- Không chạy lệnh `git commit` hoặc `git push` tự động.
- Đảm bảo `npm run build:web` và `npx tsc --noEmit` luôn đạt exit code 0.

---

### Task 1: Xây Dựng Services Layer Còn Thiếu (`users.service.ts` & `profile.service.ts`)

**Files:**
- Create: `apps/web/src/services/users.service.ts`
- Create: `apps/web/src/services/profile.service.ts`
- Modify: `apps/web/src/services/analysis.service.ts`

**Interfaces:**
- `usersService.getUsers()` -> `GET /api/users`
- `usersService.getUserById(id)` -> `GET /api/users/:id`
- `usersService.createUser(data)` -> `POST /api/users`
- `usersService.updateUser(id, data)` -> `PATCH /api/users/:id`
- `usersService.deleteUser(id)` -> `DELETE /api/users/:id`
- `profileService.getProfile()` -> `GET /api/profile`
- `profileService.updateProfile(data)` -> `PUT /api/profile`
- `profileService.changePassword(data)` -> `POST /api/auth/change-password`
- `profileService.uploadAvatar(file)` -> `POST /api/profile/avatar`
- `analysisService.getAnalysisById(id)` -> `GET /api/analyses/:id`

- [ ] **Step 1: Tạo `apps/web/src/services/users.service.ts`**
- [ ] **Step 2: Tạo `apps/web/src/services/profile.service.ts`**
- [ ] **Step 3: Cập nhật `apps/web/src/services/analysis.service.ts`** thêm `getAnalysisById` và hỗ trợ `transcriptFile`, `jdText`.
- [ ] **Step 4: Kiểm tra `npx tsc --noEmit`**

---

### Task 2: Xây Dựng Màn Hình Quản Trị Admin (`AdminUsersView.tsx`)

**Files:**
- Create: `apps/web/src/components/admin/AdminUsersView.tsx`
- Modify: `apps/web/src/types/index.ts` (thêm `'admin'` vào `MainTabType`)
- Modify: `apps/web/src/components/layout/LmsSubheader.tsx` (hiển thị tab Quản trị)
- Modify: `apps/web/src/App.tsx` (hiển thị `AdminUsersView` khi `activeTab === 'admin'`)

**Interfaces:**
- Giao diện quản lý người dùng với bảng danh sách, thanh tìm kiếm, bộ lọc vai trò, nút tạo tài khoản người dùng mới, nút sửa vai trò, nút xóa tài khoản.

- [ ] **Step 1: Mở rộng `MainTabType` trong `apps/web/src/types/index.ts`**
- [ ] **Step 2: Tạo component `AdminUsersView.tsx`**
- [ ] **Step 3: Cập nhật `LmsSubheader.tsx`** hiển thị tab Admin khi user là admin.
- [ ] **Step 4: Kết nối `AdminUsersView` vào `App.tsx`**
- [ ] **Step 5: Kiểm tra build `npm run build:web`**

---

### Task 3: Giáo Viên Thêm Tài Nguyên Học Tập (`CourseGrid.tsx` + `AddResourceModal.tsx`)

**Files:**
- Modify: `apps/web/src/components/education/CourseGrid.tsx`
- Tái sử dụng: `apps/web/src/components/resources/AddResourceModal.tsx`

**Interfaces:**
- Nút `+ Thêm tài nguyên học tập` trên `CourseGrid.tsx`.
- Form modal nhập tiêu đề, loại bài giảng/video/quiz/assignment, kỹ năng liên quan, độ khó, link học liệu, mô tả.
- Gọi `resourcesService.createResource` (`POST /api/resources`) và làm mới danh sách khóa học ngay lập tức.

- [ ] **Step 1: Thêm nút mở modal vào `CourseGrid.tsx`**
- [ ] **Step 2: Tích hợp `AddResourceModal` gọi `POST /api/resources` và trigger reload**
- [ ] **Step 3: Kiểm tra tính năng thêm tài nguyên**

---

### Task 4: Modal Quản Lý Hồ Sơ Cá Nhân & Đổi Mật Khẩu (`UserProfileModal.tsx`)

**Files:**
- Create: `apps/web/src/components/layout/UserProfileModal.tsx`
- Modify: `apps/web/src/components/layout/LmsNavbar.tsx`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- Modal 3 tab:
  - Tab 1: Hồ sơ cá nhân (Họ tên, SĐT, Bio, Chuyên ngành, Mục tiêu, Upload avatar Cloudinary).
  - Tab 2: Bảo mật & Đổi mật khẩu (Mật khẩu cũ, mật khẩu mới, xác nhận).
  - Tab 3: Giao diện (Theme Sáng/Tối, Ngôn ngữ).

- [ ] **Step 1: Tạo `UserProfileModal.tsx`**
- [ ] **Step 2: Tích hợp mở modal từ `LmsNavbar.tsx`**
- [ ] **Step 3: Kiểm tra cập nhật thông tin và đổi mật khẩu**

---

### Task 5: Bổ Sung Tải Lại Báo Cáo Theo ID & Custom JD / Bảng Điểm

**Files:**
- Modify: `apps/web/src/components/cv-scanner/FileUploadZone.tsx`
- Modify: `apps/web/src/components/history/ActivityHistory.tsx`
- Modify: `apps/web/src/components/layout/GeminiHistorySidebar.tsx`
- Modify: `apps/web/src/App.tsx`

**Interfaces:**
- `FileUploadZone`: Thêm upload bảng điểm tùy chọn và textarea Custom JD.
- `ActivityHistory` / `GeminiHistorySidebar`: Bấm vào mục quét CV cũ -> gọi `GET /api/analyses/:id` và nạp vào `CvAnalysisResult`.

- [ ] **Step 1: Thêm input bảng điểm & custom JD vào `FileUploadZone.tsx`**
- [ ] **Step 2: Kết nối click lịch sử gọi `GET /api/analyses/:id` trong `ActivityHistory.tsx`**
- [ ] **Step 3: Kiểm tra luồng quét CV đầy đủ tham số và xem lại kết quả cũ**

---

### Task 6: Kiểm Thử Toàn Diện & Nghiệm Thu (Verification)

- [ ] **Step 1: Chạy `npx tsc --noEmit`**
- [ ] **Step 2: Chạy `npm run build:web`**
- [ ] **Step 3: Chạy `npm run test:e2e -w apps/api`**
