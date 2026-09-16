import React from 'react';
import type { AnalysisScores } from '../../types/analysis.types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ReadinessScoreGaugeProps {
  scores: AnalysisScores;
}

export const ReadinessScoreGauge: React.FC<ReadinessScoreGaugeProps> = ({ scores }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.readiness_score / 100) * circumference;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Role Ready':
        return 'var(--accent-emerald)';
      case 'Competent':
        return 'var(--accent-cyan)';
      case 'Foundational':
        return 'var(--accent-amber)';
      default:
        return 'var(--accent-rose)';
    }
  };

  return (
    <Card padding="lg" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) 1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {/* Circular Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <svg width="150" height="150" viewBox="0 0 130 130">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Text in Center */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1, color: '#ffffff' }}>
                {scores.readiness_score}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                / 100 ĐIỂM
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              XẾP HẠNG SẴN SÀNG:
            </span>
            <Badge variant="emerald" size="md">
              <span style={{ color: getTierColor(scores.level_tier) }}>●</span> {scores.level_tier}
            </Badge>
          </div>
        </div>

        {/* Sub-Scores Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Chỉ Số Đánh Giá Năng Lực Toàn Diện</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Điểm số được tính toán hoàn toàn bằng các luật định lượng (Deterministic Rules), loại bỏ phán đoán cảm tính từ AI.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>ĐỘ KHỚP YÊU CẦU</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                {scores.match_percentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>So với chuẩn ngành</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>TIÊU CHUẨN ATS</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {scores.ats_score}/100
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Định dạng & từ khóa</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>NỀN TẢNG HỌC THUẬT</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {scores.academic_score}/100
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Điểm môn tiên quyết</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
