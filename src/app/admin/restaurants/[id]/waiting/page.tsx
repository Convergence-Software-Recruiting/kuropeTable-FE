'use client';

import { use } from 'react';
import { useAdminWaiting } from '@/hooks/useWaiting';
import AdminWaitingList from '@/components/waiting/AdminWaitingList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminWaitingPage({ params }: Props): React.ReactElement {
  const { id } = use(params);
  const { waitings, totalCount, loading, error, call, seat, cancel, refetch } = useAdminWaiting(id);

  if (loading) {
    return (
      <div className="app-shell-wide">
        <div className="surface-card p-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) return <ErrorFallback message={error} onRetry={refetch} />;

  return (
    <main className="app-shell-wide motion-enter">
      <section className="surface-card p-6 sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-2">
          <div>
            <p className="page-eyebrow">admin waiting</p>
            <h1 className="page-title mt-2">웨이팅 관리</h1>
          </div>
          <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#245fbd]">총 {totalCount}팀</span>
        </div>
        <AdminWaitingList waitings={waitings} onCall={call} onSeat={seat} onCancel={cancel} />
      </section>
    </main>
  );
}
