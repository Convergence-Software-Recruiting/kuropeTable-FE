'use client';

import { useState } from 'react';
import { createReservation, getAdminReservations, updateReservationStatus } from '@/lib/api/reservation';
import type { CreateReservationInput, Reservation } from '@/lib/types';

interface UseReservationResult {
  loading: boolean;
  error: string | null;
  submit: (restaurantId: string, input: CreateReservationInput) => Promise<Reservation | null>;
}

export function useReservation(): UseReservationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (restaurantId: string, input: CreateReservationInput): Promise<Reservation | null> => {
    setLoading(true);
    setError(null);
    try {
      const reservation = await createReservation(restaurantId, input);
      return reservation;
    } catch (err) {
      setError(err instanceof Error ? err.message : '예약 중 오류가 발생했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submit };
}

interface UseAdminReservationsResult {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  updateStatus: (reservationId: string, status: Reservation['status']) => Promise<void>;
}

export function useAdminReservations(restaurantId: string): UseAdminReservationsResult {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    getAdminReservations(restaurantId)
      .then(setReservations)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : '오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  });

  const updateStatus = async (reservationId: string, status: Reservation['status']): Promise<void> => {
    const updated = await updateReservationStatus(reservationId, status);
    setReservations((prev) => prev.map((r) => (r.id === reservationId ? updated : r)));
  };

  return { reservations, loading, error, updateStatus };
}
