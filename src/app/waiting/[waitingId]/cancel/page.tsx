'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelWaiting } from '@/lib/api/waiting';
import Button from '@/components/ui/Button';

interface Props {
  params: Promise<{ waitingId: string }>;
}

export default function WaitingCancelPage({ params }: Props): React.ReactElement {
  const { waitingId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelWaiting(waitingId);
      router.push('/');
    } catch {
      setError('취소 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell motion-enter">
      <section className="surface-card p-7 text-center sm:p-8">
        <p className="page-eyebrow">waiting cancel</p>
        <h1 className="page-title mt-2">웨이팅을 취소하시겠습니까?</h1>
        <p className="page-description">취소 후에는 되돌릴 수 없습니다.</p>
        {error && <p className="mt-5 text-sm font-medium text-[#b42329]">{error}</p>}
        <div className="mt-7 flex justify-center gap-2.5">
          <Button variant="secondary" onClick={() => router.back()}>
            돌아가기
          </Button>
          <Button variant="danger" onClick={handleCancel} disabled={loading}>
            {loading ? '취소 중...' : '취소 확인'}
          </Button>
        </div>
      </section>
    </main>
  );
}
