'use client';

import { use, useState } from 'react';
import { useMyWaiting } from '@/hooks/useWaiting';
import MyWaitingStatus from '@/components/waiting/MyWaitingStatus';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ waitingId: string }>;
}

export default function MyWaitingPage({ params }: Props): React.ReactElement {
  const { waitingId } = use(params);
  const { data, loading, error, cancel } = useMyWaiting(waitingId);
  const [cancelLoading, setCancelLoading] = useState(false);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="surface-card p-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !data) return <ErrorFallback message={error ?? '웨이팅 정보를 불러올 수 없습니다.'} />;

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancel();
    } finally {
      setCancelLoading(false);
    }
  };

  return <MyWaitingStatus data={data} onCancel={handleCancel} cancelLoading={cancelLoading} />;
}
