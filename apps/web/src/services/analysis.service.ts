import { apiClient } from './api-client';
import type { AnalysisResponse } from '../types/analysis.types';
import type { TargetRole } from '../types/roadmap.types';

import { roadmapService } from './roadmap.service';

export const analysisService = {
  /**
   * Calls POST /api/analyses with multipart/form-data
   * Falls back to deterministic mock if backend endpoint is not yet deployed
   */
  async analyzeCv(
    cvFile: File,
    targetRole: TargetRole,
    transcriptFile?: File | null,
    jdText?: string,
  ): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('cv_file', cvFile);
    formData.append('target_role', targetRole);
    if (transcriptFile) {
      formData.append('transcript_file', transcriptFile);
    }
    if (jdText) {
      formData.append('jd_text', jdText);
    }

    try {
      const response = await apiClient.post<AnalysisResponse>('/analyses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch {
      // Graceful fallback to mock response for seamless frontend demo
      return this.generateMockAnalysis(targetRole, cvFile.name, jdText);
    }
  },

  /**
   * Calls GET /api/analyses/:id to retrieve previously generated analysis
   */
  async getAnalysisById(id: string): Promise<AnalysisResponse> {
    const response = await apiClient.get<AnalysisResponse>(`/analyses/${id}`);
    return response.data;
  },

  /**
   * Deterministic mock analysis compliant with AGENTS.md
   */
  generateMockAnalysis(
    role: TargetRole,
    fileName = 'Resume.pdf',
    customJd?: string,
  ): AnalysisResponse {
    const gapItems = roadmapService.getDefaultGapItems(role);

    const existingSkillsByRole: Record<TargetRole, string[]> = {
      backend_developer: ['Git & GitHub', 'JavaScript / TypeScript', 'OOP Principles', 'Basic Linux CLI'],
      data_analyst: ['Excel / Google Sheets', 'Basic SQL Queries', 'Data Cleaning', 'Descriptive Statistics'],
      ai_engineer: ['Python Fundamentals', 'Linear Algebra', 'Scikit-Learn Basics', 'Git Version Control'],
      digital_marketing_specialist: ['SEO Basics', 'Content Strategy', 'Social Media Analytics', 'Copywriting'],
    };

    const existing = existingSkillsByRole[role] ?? existingSkillsByRole.backend_developer;
    const missing = gapItems.map((g) => g.skill_name);

    return {
      analysis_id: `analysis_${Date.now()}`,
      created_at: new Date().toISOString(),
      target_role: role,
      custom_jd: customJd,
      parsed_cv: {
        candidate_name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0912 345 678',
        education: 'Cử nhân Công nghệ Thông tin - Đại học Quốc Gia (2022 - 2026)',
        skills: existing,
        experience_summary: '2 đồ án môn học đại học, thực tập ngắn hạn 3 tháng.',
      },
      parsed_transcript: {
        institution: 'Đại học Công nghệ',
        major: 'Kỹ thuật Phần mềm',
        gpa: 3.25,
        courses: [
          { course_name: 'Cấu trúc dữ liệu & Giải thuật', grade: 'B+', credits: 4, relevant_to_role: true },
          { course_name: 'Cơ sở dữ liệu', grade: 'A', credits: 3, relevant_to_role: true },
          { course_name: 'Mạng máy tính', grade: 'B', credits: 3, relevant_to_role: true },
          { course_name: 'Lập trình Web', grade: 'A-', credits: 3, relevant_to_role: true },
        ],
      },
      scores: {
        readiness_score: 68,
        ats_score: 82,
        academic_score: 75,
        match_percentage: 64,
        level_tier: 'Foundational',
      },
      ats_checks: [
        { id: 'ats_1', check_name: 'Định dạng tài liệu', status: 'passed', message: `File ${fileName} có bố cục rõ ràng, dễ phân tích text.` },
        { id: 'ats_2', check_name: 'Thông tin liên hệ', status: 'passed', message: 'Có đủ Email, Số điện thoại và liên kết GitHub cá nhân.' },
        { id: 'ats_3', check_name: 'Từ khóa kỹ năng', status: 'warning', message: 'Thiếu một số từ khóa trọng điểm của vai trò này (API design, Testing).' },
      ],
      academic_checks: [
        { id: 'acad_1', subject: 'Cơ sở dữ liệu & Giải thuật', status: 'strong', feedback: 'Điểm số môn Cấu trúc dữ liệu & CSDL đạt loại khá giỏi.' },
        { id: 'acad_2', subject: 'Mạng máy tính & Hệ điều hành', status: 'acceptable', feedback: 'Đã hoàn thành các môn nền tảng hệ thống cơ bản.' },
        { id: 'acad_3', subject: 'Kiến trúc phần mềm thực chiến', status: 'gap', feedback: 'Cần bổ sung kinh nghiệm về thiết kế hệ thống và Docker container.' },
      ],
      existing_skills: existing,
      missing_skills: missing,
      gap_items: gapItems,
      prioritized_actions: [
        {
          id: 'act_1',
          order: 1,
          title: 'Học thiết kế & kiểm thử REST API',
          description: 'Nắm vững HTTP Status Code, DTO Validation và viết tài liệu Swagger.',
          priority: 'high',
          category: 'Core Skill',
        },
        {
          id: 'act_2',
          order: 2,
          title: 'Thực hành kết nối CSDL qua ORM',
          description: 'Xây dựng lược đồ cơ sở dữ liệu quan hệ và thực hiện migration dữ liệu thực tế.',
          priority: 'high',
          category: 'Backend Core',
        },
        {
          id: 'act_3',
          order: 3,
          title: 'Đóng gói ứng dụng vào Docker',
          description: 'Viết Dockerfile và Docker Compose để chạy ứng dụng trên môi trường ảo hóa.',
          priority: 'medium',
          category: 'DevOps & Tooling',
        },
      ],
    };
  },
};
