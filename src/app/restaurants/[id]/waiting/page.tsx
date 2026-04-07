'use client';

import { use } from 'react';
import { useRestaurantWaitings } from '@/hooks/useWaiting';
import WaitingStatusList from '@/components/waiting/WaitingStatusList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ id: string }>;
}

export default function WaitingPage({ params }: Props): React.ReactElement {
  const { id } = use(params);
  const { waitings, totalCount, loading, error, refetch } = useRestaurantWaitings(id);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="surface-card p-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) return <ErrorFallback message={error} onRetry={refetch} />;

  return (
    <main className="app-shell motion-enter">
      <section className="surface-card p-6 sm:p-7">
        <p className="page-eyebrow">waiting board</p>
        <h1 className="page-title mt-2">대기 현황</h1>
        <p className="page-description">실시간 순서를 확인하고 입장 시점을 준비하세요.</p>
        <div className="mt-6">
          <WaitingStatusList waitings={waitings} totalCount={totalCount} />
        </div>
      </section>
    </main>
  );
}
