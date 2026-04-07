'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateReservationStatus } from '@/lib/api/reservation';
import type { Reservation } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Props {
  params: Promise<{ id: string; resId: string }>;
}

export default function AdminReservationDetailPage({ params }: Props): React.ReactElement {
  const { resId } = use(params);
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  // 실제로는 단건 API가 필요하지만 mock 데이터에서 가져옴
  useEffect(() => {
    import('@/lib/mocks/data').then(({ mockReservations }) => {
      const found = mockReservations.find((r) => r.id === resId);
      setReservation(found ?? null);
    });
  }, [resId]);

  if (!reservation) {
    return (
      <div className="app-shell">
        <div className="surface-card p-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const handleUpdate = async (status: Reservation['status']) => {
    setLoading(true);
    try {
      const updated = await updateReservationStatus(resId, status);
      setReservation(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell motion-enter">
      <button
        onClick={() => router.back()}
        className="mb-3 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text-default)]"
      >
        ← 목록으로
      </button>

      <section className="surface-card p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="page-eyebrow">reservation detail</p>
            <h1 className="page-title mt-2">{reservation.guest_name}</h1>
          </div>
          <StatusBadge status={reservation.status} />
        </div>

        <div className="grid gap-2 text-sm text-[var(--text-default)]">
          <p>전화번호: {reservation.guest_phone}</p>
          <p>
            날짜: {reservation.reservation_date} {reservation.reservation_time}
          </p>
          <p>인원: {reservation.party_size}명</p>
          <p>코드: {reservation.reservation_code}</p>
          {reservation.request_note && <p>요청: {reservation.request_note}</p>}
        </div>

        {reservation.status !== 'CANCELED' && reservation.status !== 'VISITED' && (
          <div className="mt-6 flex flex-wrap gap-2">
            {reservation.status === 'PENDING' && (
              <Button onClick={() => handleUpdate('CONFIRMED')} disabled={loading}>
                확정
              </Button>
            )}
            {reservation.status === 'CONFIRMED' && (
              <Button variant="secondary" onClick={() => handleUpdate('VISITED')} disabled={loading}>
                방문완료
              </Button>
            )}
            <Button variant="danger" onClick={() => handleUpdate('CANCELED')} disabled={loading}>
              취소
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
