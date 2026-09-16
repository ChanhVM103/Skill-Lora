import {
  ResourceDifficulty,
  ResourceType,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';
import { ResourceResponseDto } from '../dto/resource-response.dto.js';

export const SEED_RESOURCES: ResourceResponseDto[] = [
  {
    id: 'res_001',
    title: 'Xây Dựng REST API Chuẩn với NestJS & TypeScript',
    type: ResourceType.Lecture,
    difficulty: ResourceDifficulty.Beginner,
    skill_tags: ['NestJS', 'REST API', 'TypeScript', 'Swagger'],
    url: 'https://docs.nestjs.com/first-steps',
    author: 'ThS. Trần Hoàng Nam',
    description:
      'Hướng dẫn kiến trúc Controller, Service, Module, DTO Validation và tạo tài liệu OpenAPI Swagger chuẩn chỉnh.',
    created_at: new Date('2026-09-01T08:00:00.000Z').toISOString(),
  },
  {
    id: 'res_002',
    title: 'Thiết Kế Cơ Sở Dữ Liệu Quan Hệ & Tối Ưu Index',
    type: ResourceType.Project,
    difficulty: ResourceDifficulty.Intermediate,
    skill_tags: ['PostgreSQL', 'Database Design', 'SQL', 'Prisma'],
    url: 'https://www.prisma.io/docs/concepts/components/prisma-schema',
    author: 'TS. Lê Quốc Trung',
    description:
      'Bài tập thiết kế ERD cho sàn thương mại điện tử, phân rã quan hệ 1-N, N-N và viết truy vấn JOIN hiệu năng cao.',
    created_at: new Date('2026-09-02T09:00:00.000Z').toISOString(),
  },
  {
    id: 'res_003',
    title: 'Đóng Gói Ứng Dụng Đa Dịch Vụ Bằng Docker Compose',
    type: ResourceType.Video,
    difficulty: ResourceDifficulty.Intermediate,
    skill_tags: ['Docker', 'DevOps', 'PostgreSQL', 'Linux'],
    url: 'https://docs.docker.com/compose/',
    author: 'ThS. Nguyễn Văn Hải',
    description:
      'Video thực hành tạo Dockerfile cho Node.js backend và kết nối với container database qua mạng nội bộ.',
    created_at: new Date('2026-09-03T10:00:00.000Z').toISOString(),
  },
  {
    id: 'res_004',
    title: 'Phân Tích Dữ Liệu Khách Hàng với Python & Pandas',
    type: ResourceType.Assignment,
    difficulty: ResourceDifficulty.Beginner,
    skill_tags: ['Python', 'Pandas', 'Data Cleaning', 'NumPy'],
    url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
    author: 'ThS. Vũ Thị Mai',
    description:
      'Bài tập làm sạch 10,000 dòng dữ liệu giao dịch bị thiếu, xử lý ngoại lệ và thống kê phân vị khách hàng.',
    created_at: new Date('2026-09-04T11:00:00.000Z').toISOString(),
  },
  {
    id: 'res_005',
    title: 'Thiết Kế Dashboard Trực Quan KPI Doanh Nghiệp',
    type: ResourceType.Project,
    difficulty: ResourceDifficulty.Intermediate,
    skill_tags: ['Power BI', 'Data Visualization', 'DAX', 'BI'],
    url: 'https://learn.microsoft.com/power-bi/',
    author: 'TS. Phạm Minh Tuấn',
    description:
      'Đồ án mẫu xây dựng báo cáo tài chính trực quan với bộ lọc tương tác, tính toán chỉ số DAX tăng trưởng theo tháng.',
    created_at: new Date('2026-09-05T12:00:00.000Z').toISOString(),
  },
  {
    id: 'res_006',
    title: 'Nhập Môn Mạng Nơ-ron Sâu & Huấn Luyện PyTorch',
    type: ResourceType.Lecture,
    difficulty: ResourceDifficulty.Intermediate,
    skill_tags: ['PyTorch', 'Deep Learning', 'Neural Networks', 'Python'],
    url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
    author: 'TS. Đặng Thanh Tùng',
    description:
      'Nguyên lý lan truyền ngược, hàm mất mát (loss function), bộ tối ưu Adam và xây dựng mô hình phân loại ảnh cơ bản.',
    created_at: new Date('2026-09-06T13:00:00.000Z').toISOString(),
  },
  {
    id: 'res_007',
    title: 'Xây Dựng Ứng Dụng Hỏi Đáp Tài Liệu Với RAG & Gemini',
    type: ResourceType.Project,
    difficulty: ResourceDifficulty.Advanced,
    skill_tags: ['LLM & RAG', 'Vector DB', 'Gemini API', 'FastAPI'],
    url: 'https://ai.google.dev/docs',
    author: 'ThS. Trần Hoàng Nam',
    description:
      'Đồ án thực chiến: Tách chunk tài liệu PDF, lưu vector embedding và truy xuất ngữ cảnh thông minh cho chatbot.',
    created_at: new Date('2026-09-07T14:00:00.000Z').toISOString(),
  },
  {
    id: 'res_008',
    title: 'Trắc Nghiệm Kiến Thức SQL & Chuẩn Hóa Cơ Sở Dữ Liệu',
    type: ResourceType.Quiz,
    difficulty: ResourceDifficulty.Beginner,
    skill_tags: ['SQL', 'Database Design', 'Normalization'],
    url: 'https://sqlzoo.net/',
    author: 'Khoa CNTT',
    description:
      '30 câu hỏi trắc nghiệm kiểm tra hiểu biết về 1NF, 2NF, 3NF, Khóa chính, Khóa ngoại và subquery.',
    created_at: new Date('2026-09-08T15:00:00.000Z').toISOString(),
  },
];
