import React, { useState } from 'react';
import type { ResourceDifficulty, ResourceType } from '../types/roadmap.types';
import type { ExtendedResource } from '../components/resources/ResourceCard';
import { ResourceCard } from '../components/resources/ResourceCard';
import { AddResourceModal } from '../components/resources/AddResourceModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const INITIAL_RESOURCES: ExtendedResource[] = [
  {
    id: 'res_001',
    title: 'Xây Dựng REST API Chuẩn với NestJS & TypeScript',
    type: 'lecture',
    difficulty: 'beginner',
    skill_tags: ['NestJS', 'REST API', 'TypeScript', 'Swagger'],
    url: 'https://docs.nestjs.com/first-steps',
    author: 'ThS. Trần Hoàng Nam',
    description: 'Hướng dẫn kiến trúc Controller, Service, Module, DTO Validation và tạo tài liệu OpenAPI Swagger chuẩn chỉnh.',
  },
  {
    id: 'res_002',
    title: 'Thiết Kế Cơ Sở Dữ Liệu Quan Hệ & Tối Ưu Index',
    type: 'project',
    difficulty: 'intermediate',
    skill_tags: ['PostgreSQL', 'Database Design', 'SQL', 'Prisma'],
    url: 'https://www.prisma.io/docs/concepts/components/prisma-schema',
    author: 'TS. Lê Quốc Trung',
    description: 'Bài tập thiết kế ERD cho sàn thương mại điện tử, phân rã quan hệ 1-N, N-N và viết truy vấn JOIN hiệu năng cao.',
  },
  {
    id: 'res_003',
    title: 'Đóng Gói Ứng Dụng Đa Dịch Vụ Bằng Docker Compose',
    type: 'video',
    difficulty: 'intermediate',
    skill_tags: ['Docker', 'DevOps', 'PostgreSQL', 'Linux'],
    url: 'https://docs.docker.com/compose/',
    author: 'ThS. Nguyễn Văn Hải',
    description: 'Video thực hành tạo Dockerfile cho Node.js backend và kết nối với container database qua mạng nội bộ.',
  },
  {
    id: 'res_004',
    title: 'Phân Tích Dữ Liệu Khách Hàng với Python & Pandas',
    type: 'assignment',
    difficulty: 'beginner',
    skill_tags: ['Python', 'Pandas', 'Data Cleaning', 'NumPy'],
    url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
    author: 'ThS. Vũ Thị Mai',
    description: 'Bài tập làm sạch 10,000 dòng dữ liệu giao dịch bị thiếu, xử lý ngoại lệ và thống kê phân vị khách hàng.',
  },
  {
    id: 'res_005',
    title: 'Thiết Kế Dashboard Trực Quan KPI Doanh Nghiệp',
    type: 'project',
    difficulty: 'intermediate',
    skill_tags: ['Power BI', 'Data Visualization', 'DAX', 'BI'],
    url: 'https://learn.microsoft.com/power-bi/',
    author: 'TS. Phạm Minh Tuấn',
    description: 'Đồ án mẫu xây dựng báo cáo tài chính trực quan với bộ lọc tương tác, tính toán chỉ số DAX tăng trưởng theo tháng.',
  },
  {
    id: 'res_006',
    title: 'Nhập Môn Mạng Nơ-ron Sâu & Huấn Luyện PyTorch',
    type: 'lecture',
    difficulty: 'intermediate',
    skill_tags: ['PyTorch', 'Deep Learning', 'Neural Networks', 'Python'],
    url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
    author: 'TS. Đặng Thanh Tùng',
    description: 'Nguyên lý lan truyền ngược, hàm mất mát (loss function), bộ tối ưu Adam và xây dựng mô hình phân loại ảnh cơ bản.',
  },
  {
    id: 'res_007',
    title: 'Xây Dựng Ứng Dụng Hỏi Đáp Tài Liệu Với RAG & Gemini',
    type: 'project',
    difficulty: 'advanced',
    skill_tags: ['LLM & RAG', 'Vector DB', 'Gemini API', 'FastAPI'],
    url: 'https://ai.google.dev/docs',
    author: 'ThS. Trần Hoàng Nam',
    description: 'Đồ án thực chiến: Tách chunk tài liệu PDF, lưu vector embedding và truy xuất ngữ cảnh thông minh cho chatbot.',
  },
  {
    id: 'res_008',
    title: 'Trắc Nghiệm Kiến Thức SQL & Chuẩn Hóa Cơ Sở Dữ Liệu',
    type: 'quiz',
    difficulty: 'beginner',
    skill_tags: ['SQL', 'Database Design', 'Normalization'],
    url: 'https://sqlzoo.net/',
    author: 'Khoa CNTT',
    description: '30 câu hỏi trắc nghiệm kiểm tra hiểu biết về 1NF, 2NF, 3NF, Khóa chính, Khóa ngoại và subquery.',
  },
];

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ExtendedResource[]>(INITIAL_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const allTags = Array.from(
    new Set(resources.flatMap((r) => r.skill_tags)),
  ).slice(0, 10);

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.skill_tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDiff = selectedDifficulty === 'all' || res.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesTag = selectedTag === 'all' || res.skill_tags.includes(selectedTag);

    return matchesSearch && matchesDiff && matchesType && matchesTag;
  });

  const handleAddResource = (newRes: ExtendedResource) => {
    setResources((prev) => [newRes, ...prev]);
  };

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <Badge variant="emerald" size="md" style={{ marginBottom: '0.75rem' }}>
            Teacher Curated Learning Hub
          </Badge>
          <h1 style={{ marginBottom: '0.5rem' }}>
            Kho Tài Nguyên <span className="gradient-text">Bài Giảng & Dự Án Thực Chiến</span>
          </h1>
          <p style={{ maxWidth: '650px', color: 'var(--text-secondary)' }}>
            Nguồn học liệu chất lượng cao từ các thầy cô và chuyên gia công nghệ, được gắn thẻ chuẩn xác theo từng khoảng trống kỹ năng để sinh viên ôn luyện.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
          + Đóng Góp Tài Liệu
        </Button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px', gap: '1rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm kiếm theo tên bài giảng, kỹ năng (Docker, SQL, NestJS...)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Tất cả thể loại</option>
            <option value="lecture">📖 Bài giảng</option>
            <option value="video">🎬 Video</option>
            <option value="project">🚀 Dự án mẫu</option>
            <option value="assignment">📝 Bài tập</option>
            <option value="quiz">❓ Trắc nghiệm</option>
          </select>

          <select
            className="form-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">Mọi cấp độ</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>

        {/* Quick Tag Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lọc nhanh:</span>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            style={{
              background: selectedTag === 'all' ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: 'none',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
              style={{
                background: selectedTag === tag ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedTag === tag ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Không tìm thấy tài liệu phù hợp</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Hãy thử tìm bằng từ khóa khác hoặc điều chỉnh lại các bộ lọc độ khó và thể loại.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setSelectedType('all');
              setSelectedTag('all');
            }}
          >
            Đặt Lại Bộ Lọc
          </Button>
        </div>
      )}

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddResource={handleAddResource}
      />
    </main>
  );
};
