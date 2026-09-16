import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { RoadmapGapItem, RoadmapResponse, TargetRole } from '../types/roadmap.types';
import { roadmapService } from '../services/roadmap.service';
import { PhaseTimeline } from '../components/roadmap/PhaseTimeline';
import { ResourceGapAlert } from '../components/roadmap/ResourceGapAlert';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';

export const RoadmapPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { targetRole?: TargetRole; gapItems?: RoadmapGapItem[] } | undefined;

  const [selectedRole, setSelectedRole] = useState<TargetRole>(state?.targetRole || 'backend_developer');
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async (role: TargetRole, customGaps?: RoadmapGapItem[]) => {
    setIsLoading(true);
    setError(null);

    const gaps = customGaps || roadmapService.getDefaultGapItems(role);

    try {
      const data = await roadmapService.generateRoadmap({
        target_role: role,
        starting_level: 'beginner',
        gap_items: gaps,
      });
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến Backend API để sinh lộ trình.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedRole, state?.gapItems);
  }, []);

  const handleRoleChange = (role: TargetRole) => {
    setSelectedRole(role);
    fetchRoadmap(role);
  };

  const getRoleTitle = (role: TargetRole) => {
    switch (role) {
      case 'data_analyst':
        return 'Chuyên Viên Phân Tích Dữ Liệu (Data Analyst)';
      case 'ai_engineer':
        return 'Kỹ Sư Trí Tuệ Nhân Tạo (AI Engineer)';
      case 'backend_developer':
      default:
        return 'Kỹ Sư Phát Triển Backend (Backend Developer)';
    }
  };

  return (
    <main className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Badge variant="indigo" size="md" style={{ marginBottom: '1rem' }}>
          Deterministic-First Learning Roadmap
        </Badge>
        <h1 style={{ marginBottom: '1rem' }}>
          Lộ Trình Học Tập <span className="gradient-text">Cá Nhân Hóa 4 Tuần</span>
        </h1>
        <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
          Lộ trình được sinh tự động dựa trên quy tắc chuyên môn từ Backend, bù đắp các khoảng trống kỹ năng theo mức độ ưu tiên và liên kết bài học thực chiến.
        </p>
      </div>

      {/* Interactive Role Switcher / Sandbox */}
      <Card padding="md" style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              VAI TRÒ MỤC TIÊU ĐANG KIỂM THỬ:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['backend_developer', 'data_analyst', 'ai_engineer'] as TargetRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedRole === role ? 'var(--accent-indigo)' : 'var(--border-subtle)',
                    background: selectedRole === role ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedRole === role ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {role === 'backend_developer' && '💻 Backend Developer'}
                  {role === 'data_analyst' && '📊 Data Analyst'}
                  {role === 'ai_engineer' && '🤖 AI Engineer'}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={() => fetchRoadmap(selectedRole)}
          >
            Tạo Lại Lộ Trình (Call API)
          </Button>
        </div>
      </Card>

      {/* Error Banner */}
      {error ? (
        <Card
          padding="lg"
          style={{
            marginBottom: '2rem',
            borderColor: 'rgba(244, 63, 94, 0.3)',
            background: 'rgba(244, 63, 94, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--accent-rose)', marginBottom: '0.25rem' }}>Lỗi gọi API Backend</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{error}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => fetchRoadmap(selectedRole)}>
              Thử Lại
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 1.5rem auto',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: 'var(--accent-indigo)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
            Đang sinh lộ trình học tập qua Backend Rules & AI Generator...
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Kết nối trực tiếp đến endpoint <code>POST /api/roadmaps/generate</code>
          </p>
        </div>
      ) : null}

      {/* Roadmap Content */}
      {!isLoading && roadmap ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <Card padding="md">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VAI TRÒ NGHỀ NGHIỆP</span>
              <h4 style={{ fontSize: '1.05rem', marginTop: '0.25rem' }}>{getRoleTitle(roadmap.target_role)}</h4>
            </Card>

            <Card padding="md">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>THỜI LƯỢNG ƯỚC TÍNH</span>
              <h4 style={{ fontSize: '1.05rem', marginTop: '0.25rem', color: 'var(--accent-emerald)' }}>
                {roadmap.estimated_duration_weeks} Tuần (4 Phases)
              </h4>
            </Card>

            <Card padding="md">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KHOẢNG TRỐNG CẦN BÙ ĐẮP</span>
              <h4 style={{ fontSize: '1.05rem', marginTop: '0.25rem', color: 'var(--accent-amber)' }}>
                {roadmap.improvement_items?.length || 0} Kỹ Năng Trọng Tâm
              </h4>
            </Card>

            <Card padding="md">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NGUỒN BÀI HỌC</span>
              <div style={{ marginTop: '0.25rem' }}>
                <Badge variant={roadmap.lesson_source === 'ai_generated' ? 'violet' : 'indigo'}>
                  {roadmap.lesson_source === 'ai_generated' ? '🤖 Gemini AI Enhanced' : '📐 Backend Rule Template'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Resource Gap Alerts Banner */}
          <ResourceGapAlert alerts={roadmap.resource_gap_alerts} />

          {/* Detailed Timeline */}
          <PhaseTimeline
            phases={roadmap.phases}
            fourWeekPlan={roadmap.four_week_plan}
          />
        </div>
      ) : null}
    </main>
  );
};
