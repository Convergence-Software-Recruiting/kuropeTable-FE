'use client';

import { use, useEffect, useState } from 'react';
import { getAdminReservations, updateReservationStatus } from '@/lib/api/reservation';
import AdminReservationList from '@/components/reservation/AdminReservationList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ui/ErrorFallback';
import type { Reservation } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminReservationsPage({ params }: Props): React.ReactElement {
  const { id } = use(params);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminReservations(id)
      .then(setReservations)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : '오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (reservationId: string, status: Reservation['status']) => {
    const updated = await updateReservationStatus(reservationId, status);
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? updated : r)));
  };

  if (loading) {
    return (
      <div className="app-shell-wide">
        <div className="surface-card p-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) return <ErrorFallback message={error} />;

  return (
    <main className="app-shell-wide motion-enter">
      <section className="surface-card p-6 sm:p-7">
        <p className="page-eyebrow">admin reservations</p>
        <h1 className="page-title mt-2">예약 관리</h1>
        <p className="page-description">예약 상태를 빠르게 조정하고 고객 요청을 확인하세요.</p>
        <div className="mt-6">
          <AdminReservationList reservations={reservations} onUpdateStatus={handleUpdateStatus} />
        </div>
      </section>
    </main>
  );
}
