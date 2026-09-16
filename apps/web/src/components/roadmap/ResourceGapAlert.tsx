import React from 'react';
import type { ResourceGapAlert as IResourceGapAlert } from '../../types/roadmap.types';
import { Badge } from '../common/Badge';

interface ResourceGapAlertProps {
  alerts: IResourceGapAlert[];
}

export const ResourceGapAlert: React.FC<ResourceGapAlertProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <h4 style={{ margin: 0, color: 'var(--accent-amber)', fontSize: '1.05rem' }}>
          Cảnh Báo Khoảng Trống Tài Liệu ({alerts.length} kỹ năng thiếu tài nguyên giảng viên)
        </h4>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
        Một số bước học chưa có tài liệu tương ứng từ giảng viên trong kho. Hệ thống đã bổ sung gợi ý tìm kiếm khóa học ngoài (Coursera, Udemy, tài liệu chính thức) để bạn không bị gián đoạn.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.25rem' }}>
        {alerts.map((alert, idx) => (
          <div
            key={alert.skill_id || idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(15, 23, 42, 0.75)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              fontSize: '0.825rem',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.skill_name}</span>
            <Badge variant="amber" size="sm">Cần cấp độ: {alert.needed_difficulty}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
