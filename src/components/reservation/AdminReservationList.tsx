'use client';

import type { Reservation } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  reservations: Reservation[];
  onUpdateStatus: (id: string, status: Reservation['status']) => Promise<void>;
}

export default function AdminReservationList({ reservations, onUpdateStatus }: Props): React.ReactElement {
  if (reservations.length === 0) {
    return <p className="py-10 text-center text-sm text-[var(--text-muted)]">예약이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {reservations.map((r, index) => (
        <li
          key={r.id}
          className={`surface-card motion-enter rounded-2xl p-4 ${index % 2 === 1 ? 'motion-enter-delay-1' : ''}`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-[var(--text-strong)]">{r.guest_name}</span>
              <span className="ml-2 text-sm text-[var(--text-muted)]">{r.guest_phone}</span>
            </div>
            <StatusBadge status={r.status} />
          </div>

          <p className="mb-1 text-sm text-[var(--text-default)]">
            {r.reservation_date} {r.reservation_time} · {r.party_size}명
          </p>
          <p className="mb-2 text-xs text-[var(--text-muted)]">코드: {r.reservation_code}</p>
          {r.request_note && <p className="mb-3 text-sm text-[var(--text-muted)]">요청: {r.request_note}</p>}

          {r.status !== 'CANCELED' && r.status !== 'VISITED' && (
            <div className="flex flex-wrap gap-2">
              {r.status === 'PENDING' && (
                <Button variant="primary" onClick={() => onUpdateStatus(r.id, 'CONFIRMED')}>
                  확정
                </Button>
              )}
              {r.status === 'CONFIRMED' && (
                <Button variant="secondary" onClick={() => onUpdateStatus(r.id, 'VISITED')}>
                  방문완료
                </Button>
              )}
              <Button variant="danger" onClick={() => onUpdateStatus(r.id, 'CANCELED')}>
                취소
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
