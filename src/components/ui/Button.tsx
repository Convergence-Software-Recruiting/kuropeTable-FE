'use client';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'border border-transparent bg-[var(--primary)] text-white shadow-[0_18px_30px_-22px_rgba(47,128,255,0.95)] hover:bg-[var(--primary-strong)] active:translate-y-px',
  secondary:
    'border border-[var(--line)] bg-[var(--surface-soft)] text-[#1f3f6d] hover:bg-[#eaf2ff] active:translate-y-px',
  danger:
    'border border-transparent bg-[var(--danger)] text-white shadow-[0_18px_30px_-24px_rgba(229,72,77,0.85)] hover:bg-[#cc3a45] active:translate-y-px',
  ghost: 'border border-transparent bg-transparent text-[var(--primary-strong)] hover:bg-[#eaf2ff] active:translate-y-px',
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
}: Props): React.ReactElement {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5',
        'text-sm font-semibold tracking-[-0.01em] transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(47,128,255,0.2)]',
        'disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55',
        variantClass[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
