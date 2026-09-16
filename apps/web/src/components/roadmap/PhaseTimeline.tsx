import React, { useState } from 'react';
import type { FourWeekPlan, RoadmapPhase } from '../../types/roadmap.types';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

interface PhaseTimelineProps {
  phases: RoadmapPhase[];
  fourWeekPlan?: FourWeekPlan[];
}

export const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ phases, fourWeekPlan }) => {
  const [activeTab, setActiveTab] = useState<'phases' | 'weekly'>('phases');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (stepId: string) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  const getStepTypeBadge = (type: string) => {
    switch (type) {
      case 'theory':
        return <Badge variant="indigo">Lý thuyết</Badge>;
      case 'practice':
        return <Badge variant="emerald">Thực hành</Badge>;
      case 'deliverable':
        return <Badge variant="violet">Sản phẩm đầu ra</Badge>;
      case 'assessment':
        return <Badge variant="amber">Đánh giá</Badge>;
      default:
        return <Badge variant="slate">{type}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* View Mode Toggle */}
      {fourWeekPlan && fourWeekPlan.length > 0 ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('phases')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: activeTab === 'phases' ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Theo Giai Đoạn (Phases)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: activeTab === 'weekly' ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Kế Hoạch Chi Tiết 4 Tuần (Lessons)
          </button>
        </div>
      ) : null}

      {/* Mode 1: Phases View */}
      {activeTab === 'phases' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {phases.map((phase, idx) => (
            <Card key={phase.phase || idx} padding="lg" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Subtle phase indicator in background */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  fontSize: '5rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.03)',
                  userSelect: 'none',
                }}
              >
                0{phase.phase}
              </div>

              {/* Phase Header */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant="violet" size="md">
                    Giai đoạn {phase.phase} • {phase.duration_weeks} tuần
                  </Badge>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {phase.focus_skills.map((skill) => (
                      <Badge key={skill} variant="indigo" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>{phase.title}</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>{phase.why_this_phase}</p>
              </div>

              {/* Steps List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {phase.steps.map((step, sIdx) => {
                  const isExpanded = expandedStep === step.step_id;
                  return (
                    <div
                      key={step.step_id || sIdx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem 1.25rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          gap: '1rem',
                        }}
                        onClick={() => toggleStep(step.step_id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                          {getStepTypeBadge(step.type)}
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            {step.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {step.skill_name}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded ? (
                        <div
                          style={{
                            marginTop: '1rem',
                            paddingTop: '0.85rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.65rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          {step.deliverable ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <strong style={{ color: 'var(--accent-emerald)', minWidth: '130px' }}>
                                📦 Sản phẩm đầu ra:
                              </strong>
                              <span style={{ color: 'var(--text-secondary)' }}>{step.deliverable}</span>
                            </div>
                          ) : null}

                          {step.fallback_action ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <strong style={{ color: 'var(--accent-amber)', minWidth: '130px' }}>
                                💡 Hướng dẫn tự học:
                              </strong>
                              <span style={{ color: 'var(--text-secondary)' }}>{step.fallback_action}</span>
                            </div>
                          ) : null}

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--accent-indigo)', minWidth: '130px' }}>
                              📚 Tài nguyên liên kết:
                            </strong>
                            <span style={{ color: 'var(--text-muted)' }}>
                              {step.resources && step.resources.length > 0
                                ? `${step.resources.length} tài liệu giáo viên đã khớp`
                                : 'Chưa có tài liệu giáo viên nội bộ (sử dụng gợi ý tự học)'}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Mode 2: 4-Week Detailed Lesson Plan */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {fourWeekPlan?.map((weekPlan) => (
            <Card key={weekPlan.week} padding="lg">
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <Badge variant="emerald">Tuần {weekPlan.week}</Badge>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Kỹ năng: {weekPlan.focus_skills.join(', ')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem' }}>{weekPlan.theme}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {weekPlan.lessons.map((lesson) => (
                  <div
                    key={lesson.lesson_id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {lesson.title}
                      </span>
                      <Badge variant="indigo" size="sm">{lesson.skill_name}</Badge>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <strong>Hoạt động:</strong> {lesson.activity}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <strong>Thực hành:</strong> {lesson.practice}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>
                      <strong>Nộp bài:</strong> {lesson.deliverable}
                    </div>

                    {lesson.external_courses && lesson.external_courses.length > 0 ? (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gợi ý khóa học bổ trợ: </span>
                        {lesson.external_courses.map((course) => (
                          <a
                            key={course.search_url}
                            href={course.search_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.8rem', marginLeft: '0.4rem', textDecoration: 'underline' }}
                          >
                            {course.provider} ({course.search_query})
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
