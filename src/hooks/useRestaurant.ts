'use client';

import { useEffect, useState } from 'react';
import { getRestaurant } from '@/lib/api/restaurant';
import type { Restaurant } from '@/lib/types';

interface UseRestaurantResult {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRestaurant(id: string): UseRestaurantResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getRestaurant(id)
      .then((data) => { if (!cancelled) { setRestaurant(data); setError(null); } })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : '오류가 발생했습니다.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, tick]);

  return { restaurant, loading, error, refetch: () => setTick((t) => t + 1) };
}
