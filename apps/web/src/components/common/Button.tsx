import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style,
  ...rest
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 600,
      fontFamily: 'inherit',
      borderRadius: 'var(--radius-md)',
      border: '1px solid transparent',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    };

    // Sizes
    const sizes: Record<ButtonSize, React.CSSProperties> = {
      sm: { padding: '0.4rem 0.85rem', fontSize: '0.85rem' },
      md: { padding: '0.65rem 1.35rem', fontSize: '0.95rem' },
      lg: { padding: '0.85rem 1.85rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' },
    };

    // Variants
    const variants: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        background: 'var(--grad-primary)',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-subtle)',
      },
      outline: {
        background: 'transparent',
        color: 'var(--accent-indigo)',
        borderColor: 'var(--accent-indigo)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
      },
      danger: {
        background: 'rgba(244, 63, 94, 0.15)',
        color: 'var(--accent-rose)',
        borderColor: 'rgba(244, 63, 94, 0.3)',
      },
    };

    return { ...base, ...sizes[size], ...variants[variant], ...style };
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={getStyles()}
      className={`skillora-btn ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      ) : leftIcon ? (
        <span>{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon ? <span>{rightIcon}</span> : null}
    </button>
  );
};
