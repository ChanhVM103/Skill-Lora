import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '../types/analysis.types';
import { analysisService } from '../services/analysis.service';
import { ReadinessScoreGauge } from '../components/result/ReadinessScoreGauge';
import { SkillComparisonTable } from '../components/result/SkillComparisonTable';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { analysis?: AnalysisResponse } | undefined;
  // Fallback to mock data if accessed directly without upload state
  const analysis: AnalysisResponse =
    state?.analysis || analysisService.generateMockAnalysis('backend_developer');

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'data_analyst':
        return 'Data Analyst';
      case 'ai_engineer':
        return 'AI Engineer';
      case 'backend_developer':
      default:
        return 'Backend Developer';
    }
  };

  const handleGoToRoadmap = () => {
    navigate('/roadmap', {
      state: {
        targetRole: analysis.target_role,
        gapItems: analysis.gap_items,
      },
    });
  };

  return (
    <main className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-indigo)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '0.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: 0,
            }}
          >
            ← Tải lên hồ sơ khác
          </button>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            Báo Cáo Sẵn Sàng <span className="gradient-text">{getRoleLabel(analysis.target_role)}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Hồ sơ: <strong style={{ color: 'var(--text-primary)' }}>{analysis.parsed_cv.candidate_name || 'Ứng viên'}</strong> • Mã phân tích: <code style={{ fontSize: '0.8rem' }}>{analysis.analysis_id}</code>
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleGoToRoadmap}>
          Xem Lộ Trình 4 Tuần →
        </Button>
      </div>

      {/* Score Summary Gauge */}
      <ReadinessScoreGauge scores={analysis.scores} />

      {/* ATS and Academic Checks */}
      <div className="grid grid-cols-2 gap-6">
        {/* ATS Checks */}
        <Card padding="lg">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📄</span> Tiêu Chuẩn Hồ Sơ Tuyển Dụng (ATS)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.ats_checks.map((check) => (
              <div
                key={check.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{check.check_name}</span>
                  <Badge variant={check.status === 'passed' ? 'emerald' : check.status === 'warning' ? 'amber' : 'rose'} size="sm">
                    {check.status === 'passed' ? 'Đạt chuẩn' : check.status === 'warning' ? 'Cần cải thiện' : 'Chưa đạt'}
                  </Badge>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{check.message}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Academic Prerequisites */}
        <Card padding="lg">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎓</span> Tín Hiệu Nền Tảng Học Thuật (Transcript)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.academic_checks.map((check) => (
              <div
                key={check.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{check.subject}</span>
                  <Badge variant={check.status === 'strong' ? 'emerald' : check.status === 'acceptable' ? 'indigo' : 'amber'} size="sm">
                    {check.status === 'strong' ? 'Nền tảng vững' : check.status === 'acceptable' ? 'Đạt chuẩn' : 'Có khoảng trống'}
                  </Badge>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{check.feedback}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skill Comparison Table */}
      <SkillComparisonTable
        existingSkills={analysis.existing_skills}
        gapItems={analysis.gap_items}
      />

      {/* Prioritized Actions */}
      <Card padding="lg">
        <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          🎯 Danh Sách Hành Động Cần Ưu Tiên Thực Hiện
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {analysis.prioritized_actions.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid var(--border-subtle)',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {act.order}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{act.title}</span>
                  <Badge severity={act.priority} size="sm">
                    {act.priority === 'high' ? 'Ưu tiên số 1' : 'Khuyến nghị'}
                  </Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {act.category}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Floating CTA */}
      <Card
        padding="lg"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          borderColor: 'var(--accent-indigo)',
        }}
      >
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Bắt Đầu Lộ Trình 4 Tuần Để Đóng Các Khoảng Trống Kỹ Năng Này
        </h3>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: 'var(--text-secondary)' }}>
          Hệ thống sẽ chuyển các kỹ năng còn thiếu của bạn sang bộ tạo lộ trình tự động (Roadmap Generator) với đề bài thực chiến và tài liệu bài giảng phù hợp.
        </p>
        <Button variant="primary" size="lg" onClick={handleGoToRoadmap}>
          Tạo Lộ Trình Học Tập Chi Tiết Ngay 🚀
        </Button>
      </Card>
    </main>
  );
};
