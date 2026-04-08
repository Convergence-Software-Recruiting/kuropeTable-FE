'use client';

import type { Waiting } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  waitings: Waiting[];
  onCall: (id: string) => Promise<void>;
  onSeat: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

export default function AdminWaitingList({ waitings, onCall, onSeat, onCancel }: Props): React.ReactElement {
  const active = waitings.filter((w) => w.status === 'WAITING' || w.status === 'CALLED');

  if (active.length === 0) {
    return <p className="py-10 text-center text-sm text-[var(--text-muted)]">대기 중인 팀이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {active.map((w, index) => (
        <li
          key={w.id}
          className={`surface-card motion-enter rounded-2xl p-4 ${index % 2 === 1 ? 'motion-enter-delay-1' : ''}`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--primary)]">#{w.waiting_number}</span>
              <span className="font-semibold text-[var(--text-strong)]">{w.guest_name}</span>
              <span className="text-sm text-[var(--text-muted)]">{w.party_size}명</span>
            </div>
            <StatusBadge status={w.status} />
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            코드: {w.waiting_code} · {w.registered_channel === 'REMOTE' ? '원격' : '현장'}
          </p>
          {w.onsite_verified && <p className="mt-1 text-xs font-semibold text-[#0f8546]">현장 인증 완료</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            {w.status === 'WAITING' && <Button onClick={() => onCall(w.id)}>호출</Button>}
            <Button variant="secondary" onClick={() => onSeat(w.id)} disabled={w.status !== 'CALLED'}>
              입장
            </Button>
            <Button variant="danger" onClick={() => onCancel(w.id)}>
              취소
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
