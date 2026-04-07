'use client';

import type { WaitingStatusResponse } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  data: WaitingStatusResponse;
  onCancel: () => Promise<void>;
  cancelLoading?: boolean;
}

export default function MyWaitingStatus({ data, onCancel, cancelLoading = false }: Props): React.ReactElement {
  const { waiting, ahead_count } = data;
  const isCalled = waiting.status === 'CALLED';
  const needsOnsiteVerify = ahead_count <= waiting.waiting_number && !waiting.onsite_verified && waiting.status === 'WAITING';

  return (
    <main className="app-shell motion-enter">
      <section className="surface-card p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="page-eyebrow">my waiting</p>
            <h1 className="page-title mt-2">내 웨이팅</h1>
          </div>
          <StatusBadge status={waiting.status} />
        </div>

        {isCalled && (
          <div className="mb-5 rounded-2xl border border-[#c8dcff] bg-[#edf4ff] px-4 py-4" role="alert">
            <p className="text-base font-bold text-[#1e5fca]">입장 호출이 왔습니다!</p>
            <p className="mt-1 text-sm text-[#3363ad]">직원에게 안내를 받아주세요.</p>
          </div>
        )}

        <div className="surface-soft mb-5 rounded-2xl px-5 py-6 text-center">
          <p className="text-sm font-medium text-[var(--text-muted)]">내 대기 번호</p>
          <p className="mt-1 text-5xl font-extrabold tracking-[-0.02em] text-[var(--primary)]">#{waiting.waiting_number}</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            앞에 <span className="font-semibold text-[var(--text-strong)]">{ahead_count}팀</span> 남았습니다.
          </p>
        </div>

        {needsOnsiteVerify && (
          <div className="mb-5 rounded-2xl border border-[#f3dfbe] bg-[#fff7ea] px-4 py-4" role="alert">
            <p className="font-semibold text-[#9b6b1a]">현장 인증이 필요합니다</p>
            <p className="mt-1 text-sm text-[#9b6b1a]">
              매장 직원에게 웨이팅 코드를 보여주세요: <strong>{waiting.waiting_code}</strong>
            </p>
          </div>
        )}

        <div className="surface-soft rounded-2xl px-4 py-4 text-sm text-[var(--text-default)]">
          <p>이름: {waiting.guest_name}</p>
          <p className="mt-1">인원: {waiting.party_size}명</p>
          <p className="mt-1">웨이팅 코드: {waiting.waiting_code}</p>
        </div>

        {waiting.status === 'WAITING' && (
          <div className="mt-6">
            <Button variant="danger" fullWidth onClick={onCancel} disabled={cancelLoading}>
              {cancelLoading ? '취소 중...' : '웨이팅 취소'}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
