import React from 'react';
import type { TargetRole } from '../../types/roadmap.types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface RoleSelectorProps {
  selectedRole: TargetRole;
  onSelectRole: (role: TargetRole) => void;
}

interface RoleOption {
  id: TargetRole;
  title: string;
  icon: string;
  badge: string;
  description: string;
  keySkills: string[];
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  const roles: RoleOption[] = [
    {
      id: 'backend_developer',
      title: 'Backend Developer',
      icon: '💻',
      badge: 'Phổ biến',
      description: 'Thiết kế REST API, kiến trúc cơ sở dữ liệu quan hệ, xử lý logic nghiệp vụ và triển khai Docker.',
      keySkills: ['NestJS/Node', 'SQL & ORM', 'REST API', 'Docker'],
    },
    {
      id: 'data_analyst',
      title: 'Data Analyst',
      icon: '📊',
      badge: 'Nhu cầu cao',
      description: 'Khai phá dữ liệu số liệu, xây dựng dashboard trực quan, phân tích xu hướng KPI và xử lý SQL nâng cao.',
      keySkills: ['Advanced SQL', 'Power BI / Tableau', 'Python Pandas', 'Data Modeling'],
    },
    {
      id: 'ai_engineer',
      title: 'AI Engineer',
      icon: '🤖',
      badge: 'Xu hướng mới',
      description: 'Phát triển mô hình Học máy, Tinh chỉnh LLM, xây dựng ứng dụng RAG và đóng gói mô hình AI qua API.',
      keySkills: ['PyTorch / ML', 'LLM & RAG', 'Python', 'FastAPI Serving'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        1. Chọn vai trò nghề nghiệp bạn hướng tới:
      </label>

      <div className="grid grid-cols-3 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              style={{ cursor: 'pointer', height: '100%' }}
            >
              <Card
                padding="md"
                interactive
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderWidth: '2px',
                  borderColor: isSelected ? 'var(--accent-indigo)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'var(--shadow-md)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{role.icon}</span>
                    <Badge variant={isSelected ? 'indigo' : 'slate'} size="sm">
                      {role.badge}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                    {role.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {role.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {role.keySkills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#a5b4fc' : 'var(--text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
