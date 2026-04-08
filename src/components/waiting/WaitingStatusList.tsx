'use client';

import type { Waiting } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';

interface Props {
  waitings: Waiting[];
  totalCount: number;
}

export default function WaitingStatusList({ waitings, totalCount }: Props): React.ReactElement {
  if (waitings.length === 0) {
    return <p className="py-10 text-center text-sm text-[var(--text-muted)]">현재 대기 중인 팀이 없습니다.</p>;
  }

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-[var(--text-muted)]">현재 대기 {totalCount}팀</p>
      <ul className="flex flex-col gap-3">
        {waitings.map((w, index) => (
          <li
            key={w.id}
            className={`surface-soft motion-enter flex items-center justify-between rounded-2xl p-4 ${
              index % 2 === 1 ? 'motion-enter-delay-1' : ''
            }`}
          >
            <div>
              <span className="mr-2 text-lg font-bold text-[var(--primary)]">#{w.waiting_number}</span>
              <span className="text-sm font-semibold text-[var(--text-strong)]">{w.guest_name}</span>
              <span className="ml-2 text-xs text-[var(--text-muted)]">{w.party_size}명</span>
            </div>
            <StatusBadge status={w.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
