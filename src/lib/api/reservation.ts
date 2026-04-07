import type { CreateReservationInput, Reservation } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function createReservation(restaurantId: string, input: CreateReservationInput): Promise<Reservation> {
  const res = await fetch(`${BASE}/api/restaurants/${restaurantId}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create reservation: ${res.status}`);
  return res.json() as Promise<Reservation>;
}

export async function getAdminReservations(restaurantId: string): Promise<Reservation[]> {
  const res = await fetch(`${BASE}/api/admin/restaurants/${restaurantId}/reservations`);
  if (!res.ok) throw new Error(`Failed to fetch reservations: ${res.status}`);
  const data = await res.json() as { reservations: Reservation[] };
  return data.reservations;
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation['status'],
): Promise<Reservation> {
  const res = await fetch(`${BASE}/api/admin/reservations/${reservationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update reservation: ${res.status}`);
  return res.json() as Promise<Reservation>;
}
