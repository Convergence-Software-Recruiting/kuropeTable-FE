interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeClass = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-11 w-11' };

export default function LoadingSpinner({ size = 'md', label = '로딩 중...' }: Props): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5" role="status" aria-label={label}>
      <div className={`animate-spin rounded-full border-2 border-[#d9e7ff] border-t-[var(--primary)] ${sizeClass[size]}`} />
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
