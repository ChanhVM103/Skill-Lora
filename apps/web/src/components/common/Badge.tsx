import React from 'react';

export type BadgeVariant = 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';
export type BadgeSeverity = 'high' | 'medium' | 'low';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  severity?: BadgeSeverity;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  severity,
  size = 'md',
  className = '',
  style,
  ...rest
}) => {
  // Map severity to variant
  let activeVariant = variant;
  if (severity === 'high') activeVariant = 'rose';
  else if (severity === 'medium') activeVariant = 'amber';
  else if (severity === 'low') activeVariant = 'indigo';

  const stylesByVariant: Record<BadgeVariant, React.CSSProperties> = {
    indigo: {
      background: 'rgba(99, 102, 241, 0.15)',
      color: '#818cf8',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    },
    violet: {
      background: 'rgba(139, 92, 246, 0.15)',
      color: '#a78bfa',
      border: '1px solid rgba(139, 92, 246, 0.3)',
    },
    emerald: {
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    amber: {
      background: 'rgba(245, 158, 11, 0.15)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    rose: {
      background: 'rgba(244, 63, 94, 0.15)',
      color: '#fb7185',
      border: '1px solid rgba(244, 63, 94, 0.3)',
    },
    slate: {
      background: 'rgba(148, 163, 184, 0.1)',
      color: '#94a3b8',
      border: '1px solid rgba(148, 163, 184, 0.2)',
    },
  };

  const sizeStyles: Record<'sm' | 'md', React.CSSProperties> = {
    sm: { padding: '0.15rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.825rem' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...stylesByVariant[activeVariant],
        ...style,
      }}
      className={`skillora-badge ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
