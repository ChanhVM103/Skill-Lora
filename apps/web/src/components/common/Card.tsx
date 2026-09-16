import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  glow = false,
  padding = 'md',
  className = '',
  style,
  ...rest
}) => {
  const paddingMap = {
    none: '0',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    backdropFilter: 'var(--backdrop-blur)',
    WebkitBackdropFilter: 'var(--backdrop-blur)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: glow ? 'var(--shadow-glow), var(--shadow-md)' : 'var(--shadow-md)',
    padding: paddingMap[padding],
    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={`skillora-card ${interactive ? 'glass-card-interactive' : 'glass-card'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
