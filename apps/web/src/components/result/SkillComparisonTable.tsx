import React from 'react';
import type { RoadmapGapItem } from '../../types/roadmap.types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface SkillComparisonTableProps {
  existingSkills: string[];
  gapItems: RoadmapGapItem[];
}

export const SkillComparisonTable: React.FC<SkillComparisonTableProps> = ({
  existingSkills,
  gapItems,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Existing Skills Card */}
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✓</span> Kỹ Năng Đã Có
            </h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Trích xuất có bằng chứng xác thực từ CV và Bảng điểm
            </span>
          </div>
          <Badge variant="emerald" size="md">{existingSkills.length} kỹ năng</Badge>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {existingSkills.map((skill) => (
            <div
              key={skill}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.875rem',
                color: '#ffffff',
                fontWeight: 500,
              }}
            >
              <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem' }}>✓</span>
              {skill}
            </div>
          ))}
        </div>
      </Card>

      {/* Gap Items Card */}
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠</span> Khoảng Trống Kỹ Năng (Gaps)
            </h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Cần bổ sung hoặc cải thiện để đáp ứng tiêu chuẩn tuyển dụng
            </span>
          </div>
          <Badge variant="rose" size="md">{gapItems.length} khoảng trống</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {gapItems.map((gap, idx) => (
            <div
              key={gap.skill_id || idx}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {gap.skill_name}
                </span>
                <Badge severity={gap.severity} size="sm">
                  {gap.severity === 'high' ? 'Ưu tiên cao' : gap.severity === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                </Badge>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Hiện tại: <strong style={{ color: 'var(--text-secondary)' }}>{gap.current_level}</strong></span>
                <span>•</span>
                <span>Mục tiêu: <strong style={{ color: 'var(--accent-indigo)' }}>{gap.target_level}</strong></span>
              </div>

              {gap.reason ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  💡 {gap.reason}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
