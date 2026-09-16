import React from 'react';
import type { ResourceDifficulty, ResourceType, RoadmapResource } from '../../types/roadmap.types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface ExtendedResource extends RoadmapResource {
  author?: string;
  description?: string;
}

interface ResourceCardProps {
  resource: ExtendedResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'video':
        return '🎬';
      case 'project':
        return '🚀';
      case 'assignment':
        return '📝';
      case 'quiz':
        return '❓';
      case 'article':
        return '📰';
      case 'lecture':
      default:
        return '📖';
    }
  };

  const getDifficultyBadge = (diff: ResourceDifficulty) => {
    switch (diff) {
      case 'advanced':
        return <Badge variant="rose" size="sm">Nâng cao</Badge>;
      case 'intermediate':
        return <Badge variant="amber" size="sm">Trung cấp</Badge>;
      case 'beginner':
      default:
        return <Badge variant="emerald" size="sm">Cơ bản</Badge>;
    }
  };

  return (
    <Card
      padding="md"
      interactive
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(resource.type)}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {resource.type}
            </span>
          </div>
          {getDifficultyBadge(resource.difficulty)}
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#ffffff', lineHeight: 1.4 }}>
          {resource.title}
        </h3>

        {resource.description ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {resource.description}
          </p>
        ) : null}
      </div>

      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {resource.skill_tags.map((tag) => (
            <Badge key={tag} variant="indigo" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            Đóng góp bởi: <strong style={{ color: 'var(--text-secondary)' }}>{resource.author || 'Giảng viên Skillora'}</strong>
          </span>

          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent-indigo)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              Học ngay ↗
            </a>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Tài liệu nội bộ</span>
          )}
        </div>
      </div>
    </Card>
  );
};
