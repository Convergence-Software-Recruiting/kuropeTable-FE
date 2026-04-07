import Button from '@/components/ui/Button';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({ message = '오류가 발생했습니다.', onRetry }: Props): React.ReactElement {
  return (
    <div className="motion-enter app-shell">
      <div className="surface-card mx-auto max-w-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffeef0] text-[#c03542]">
          <span className="text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-[var(--text-strong)]">문제가 발생했어요</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{message}</p>
        {onRetry && (
          <div className="mt-6 flex justify-center">
            <Button onClick={onRetry}>다시 시도</Button>
          </div>
        )}
      </div>
    </div>
  );
}
