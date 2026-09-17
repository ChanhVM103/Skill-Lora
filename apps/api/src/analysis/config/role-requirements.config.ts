import {
  GapCategory,
  GapSeverity,
  TargetRole,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';

export interface SkillRequirement {
  skill_id: string;
  skill_name: string;
  category: GapCategory;
  importance: number; // 1 - 5
  target_level: 'basic' | 'intermediate' | 'advanced' | 'portfolio';
  keywords: string[];
}

export interface RoleProfileConfig {
  role: TargetRole;
  title: string;
  core_skills: SkillRequirement[];
  ats_keywords: string[];
  prerequisite_courses: string[];
}

export const ROLE_REQUIREMENTS: Record<TargetRole, RoleProfileConfig> = {
  [TargetRole.BackendDeveloper]: {
    role: TargetRole.BackendDeveloper,
    title: 'Kỹ Sư Phát Triển Backend (Backend Developer)',
    core_skills: [
      {
        skill_id: 'rest_api',
        skill_name: 'RESTful API & Validation',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['rest', 'api', 'http', 'crud', 'dto', 'validation', 'swagger', 'endpoint'],
      },
      {
        skill_id: 'sql_orm',
        skill_name: 'Database Design & Relational SQL / ORM',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['sql', 'postgres', 'mysql', 'database', 'prisma', 'typeorm', 'erd', 'migration'],
      },
      {
        skill_id: 'docker',
        skill_name: 'Docker & Containerization',
        category: GapCategory.AppliedProject,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['docker', 'container', 'docker-compose', 'image', 'dockerfile'],
      },
      {
        skill_id: 'git_workflow',
        skill_name: 'Git Version Control & PR Workflow',
        category: GapCategory.Foundation,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['git', 'github', 'branch', 'pr', 'pull request', 'version control'],
      },
      {
        skill_id: 'backend_security',
        skill_name: 'Authentication & Security (JWT, Guards)',
        category: GapCategory.Core,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['jwt', 'auth', 'bcrypt', 'security', 'guard', 'token', 'authorization'],
      },
    ],
    ats_keywords: [
      'REST API',
      'PostgreSQL',
      'MySQL',
      'Docker',
      'TypeScript',
      'Node.js',
      'NestJS',
      'Git',
      'Unit Test',
    ],
    prerequisite_courses: [
      'Cấu trúc dữ liệu & Giải thuật',
      'Cơ sở dữ liệu',
      'Mạng máy tính',
      'Lập trình hướng đối tượng (OOP)',
      'Hệ điều hành',
    ],
  },

  [TargetRole.DataAnalyst]: {
    role: TargetRole.DataAnalyst,
    title: 'Chuyên Viên Phân Tích Dữ Liệu (Data Analyst)',
    core_skills: [
      {
        skill_id: 'sql_advanced',
        skill_name: 'SQL Phân Tích Nâng Cao (Window Functions, CTE)',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['sql', 'window function', 'cte', 'subquery', 'aggregation', 'join', 'group by'],
      },
      {
        skill_id: 'power_bi',
        skill_name: 'Xây Dựng Báo Cáo Trực Quan (Power BI / Tableau)',
        category: GapCategory.AppliedProject,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['power bi', 'tableau', 'dashboard', 'dax', 'kpi', 'visualization', 'chart'],
      },
      {
        skill_id: 'python_pandas',
        skill_name: 'Python Xử Lý & Làm Sạch Dữ Liệu (Pandas, NumPy)',
        category: GapCategory.Core,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['python', 'pandas', 'numpy', 'data cleaning', 'eda', 'jupyter', 'data frame'],
      },
      {
        skill_id: 'statistics',
        skill_name: 'Xác Suất Thống Kê & Phân Tích Xu Hướng',
        category: GapCategory.Foundation,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['thống kê', 'statistics', 'hypothesis testing', 'a/b test', 'regression', 'mean', 'median'],
      },
    ],
    ats_keywords: [
      'SQL',
      'Power BI',
      'Tableau',
      'Python',
      'Pandas',
      'Excel',
      'Data Modeling',
      'KPI Dashboard',
    ],
    prerequisite_courses: [
      'Cơ sở dữ liệu',
      'Xác suất thống kê',
      'Đại số tuyến tính',
      'Khai phá dữ liệu (Data Mining)',
    ],
  },
  [TargetRole.FrontendReactjs]: {
    role: TargetRole.FrontendReactjs,
    title: 'Kỹ Sư Frontend ReactJS',
    core_skills: [
      {
        skill_id: 'react_fiber_concurrent',
        skill_name: 'React Fiber & Concurrent Rendering',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'advanced',
        keywords: ['react', 'fiber', 'concurrent', 'usetransition', 'usedeferredvalue', 'server components'],
      },
      {
        skill_id: 'web_vitals_bundle_splitting',
        skill_name: 'Web Vitals Optimization & Bundle Splitting',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'advanced',
        keywords: ['lcp', 'inp', 'cls', 'web vitals', 'bundle splitting', 'dynamic import', 'lighthouse'],
      },
      {
        skill_id: 'frontend_testing_cicd',
        skill_name: 'Playwright E2E, Visual Regression & CI/CD',
        category: GapCategory.Portfolio,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['playwright', 'e2e', 'visual regression', 'github actions', 'ci/cd'],
      },
      {
        skill_id: 'micro_frontend_architecture',
        skill_name: 'Micro-Frontend & Module Federation Architecture',
        category: GapCategory.AppliedProject,
        importance: 4,
        target_level: 'advanced',
        keywords: ['micro-frontend', 'module federation', 'vite', 'webpack', 'shared state'],
      },
    ],
    ats_keywords: [
      'React',
      'TypeScript',
      'Web Vitals',
      'Vite',
      'Playwright',
      'Micro-Frontend',
      'Module Federation',
      'Performance Optimization',
    ],
    prerequisite_courses: [
      'Lập trình Web',
      'Lập trình hướng đối tượng (OOP)',
      'Cấu trúc dữ liệu & Giải thuật',
      'Kiểm thử phần mềm',
    ],
  },

  [TargetRole.AiEngineer]: {
    role: TargetRole.AiEngineer,
    title: 'Kỹ Sư Trí Tuệ Nhân Tạo (AI Engineer)',
    core_skills: [
      {
        skill_id: 'deep_learning',
        skill_name: 'Mạng Nơ-ron & Học Sâu (PyTorch / TensorFlow)',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['pytorch', 'tensorflow', 'neural network', 'deep learning', 'cnn', 'rnn', 'loss'],
      },
      {
        skill_id: 'llm_finetuning',
        skill_name: 'Ứng Dụng LLM, Prompt Engineering & RAG',
        category: GapCategory.AppliedProject,
        importance: 5,
        target_level: 'advanced',
        keywords: ['llm', 'rag', 'vector database', 'embedding', 'prompt', 'langchain', 'gemini'],
      },
      {
        skill_id: 'model_deployment',
        skill_name: 'Đóng Gói & Triển Khai Mô Hình (FastAPI, Docker)',
        category: GapCategory.Portfolio,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['fastapi', 'docker', 'deployment', 'serving', 'inference', 'api', 'onnx'],
      },
      {
        skill_id: 'math_foundations',
        skill_name: 'Toán Học Cho AI (Đại Số Tuyến Tính, Giải Tích)',
        category: GapCategory.Foundation,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['linear algebra', 'calculus', 'matrix', 'gradient descent', 'toán', 'đại số'],
      },
    ],
    ats_keywords: [
      'Python',
      'PyTorch',
      'Machine Learning',
      'Deep Learning',
      'LLM',
      'RAG',
      'FastAPI',
      'Docker',
      'Vector DB',
    ],
    prerequisite_courses: [
      'Đại số tuyến tính',
      'Giải tích & Tối ưu hóa',
      'Xác suất thống kê',
      'Cấu trúc dữ liệu & Giải thuật',
      'Trí tuệ nhân tạo cơ bản',
    ],
  },

  [TargetRole.DigitalMarketingSpecialist]: {
    role: TargetRole.DigitalMarketingSpecialist,
    title: 'Chuyên Viên Digital Marketing',
    core_skills: [
      {
        skill_id: 'seo_sem',
        skill_name: 'Tối Ưu Hóa Tìm Kiếm (SEO & SEM)',
        category: GapCategory.Core,
        importance: 5,
        target_level: 'intermediate',
        keywords: ['seo', 'sem', 'google ads', 'keyword', 'ranking', 'backlink'],
      },
      {
        skill_id: 'content_strategy',
        skill_name: 'Chiến Lược Nội Dung & Copywriting',
        category: GapCategory.AppliedProject,
        importance: 4,
        target_level: 'intermediate',
        keywords: ['content', 'copywriting', 'storytelling', 'blog', 'social media'],
      },
    ],
    ats_keywords: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Ads', 'Copywriting'],
    prerequisite_courses: ['Nguyên lý Marketing', 'Nghiên cứu thị trường', 'Hành vi người tiêu dùng'],
  },
};

