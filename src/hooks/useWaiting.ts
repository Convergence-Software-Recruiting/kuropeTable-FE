'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  cancelWaiting,
  callWaiting,
  createWaiting,
  getMyWaiting,
  getRestaurantWaitings,
  seatWaiting,
} from '@/lib/api/waiting';
import type { CreateWaitingInput, Waiting, WaitingStatusResponse } from '@/lib/types';

const POLLING_INTERVAL = 5000;

// 웨이팅 등록
interface UseCreateWaitingResult {
  loading: boolean;
  error: string | null;
  submit: (restaurantId: string, input: CreateWaitingInput) => Promise<Waiting | null>;
}

export function useCreateWaiting(): UseCreateWaitingResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (restaurantId: string, input: CreateWaitingInput): Promise<Waiting | null> => {
    setLoading(true);
    setError(null);
    try {
      return await createWaiting(restaurantId, input);
    } catch (err) {
      setError(err instanceof Error ? err.message : '웨이팅 등록 중 오류가 발생했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}

// 내 웨이팅 상태 (5초 폴링)
interface UseMyWaitingResult {
  data: WaitingStatusResponse | null;
  loading: boolean;
  error: string | null;
  cancel: () => Promise<void>;
}

export function useMyWaiting(waitingId: string): UseMyWaitingResult {
  const [data, setData] = useState<WaitingStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await getMyWaiting(waitingId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [waitingId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const cancel = async (): Promise<void> => {
    await cancelWaiting(waitingId);
    await fetchData();
  };

  return { data, loading, error, cancel };
}

// 식당 웨이팅 현황
interface UseRestaurantWaitingsResult {
  waitings: Waiting[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRestaurantWaitings(restaurantId: string): UseRestaurantWaitingsResult {
  const [waitings, setWaitings] = useState<Waiting[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getRestaurantWaitings(restaurantId)
      .then((res) => {
        if (!cancelled) {
          setWaitings(res.waitings);
          setTotalCount(res.total_count);
        }
      })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : '오류가 발생했습니다.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [restaurantId, tick]);

  return { waitings, totalCount, loading, error, refetch: () => setTick((t) => t + 1) };
}

// 어드민 웨이팅 관리
interface UseAdminWaitingResult {
  waitings: Waiting[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  call: (waitingId: string) => Promise<void>;
  seat: (waitingId: string) => Promise<void>;
  cancel: (waitingId: string) => Promise<void>;
  refetch: () => void;
}

export function useAdminWaiting(restaurantId: string): UseAdminWaitingResult {
  const [waitings, setWaitings] = useState<Waiting[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getRestaurantWaitings(restaurantId)
      .then((res) => {
        if (!cancelled) {
          setWaitings(res.waitings);
          setTotalCount(res.total_count);
        }
      })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : '오류가 발생했습니다.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [restaurantId, tick]);

  const updateWaiting = (updated: Waiting) =>
    setWaitings((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));

  const call = async (waitingId: string) => updateWaiting(await callWaiting(waitingId));
  const seat = async (waitingId: string) => updateWaiting(await seatWaiting(waitingId));
  const cancel = async (waitingId: string) => updateWaiting(await cancelWaiting(waitingId));

  return { waitings, totalCount, loading, error, call, seat, cancel, refetch: () => setTick((t) => t + 1) };
}
