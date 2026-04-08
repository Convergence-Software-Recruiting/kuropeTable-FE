import type { CreateReservationInput, Reservation } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

export async function createReservation(restaurantId: string, input: CreateReservationInput): Promise<Reservation> {
  const response = await apiClient.post<Reservation>(`/api/restaurants/${restaurantId}/reservations`, input);
  return response.data;
}

export async function getAdminReservations(restaurantId: string): Promise<Reservation[]> {
  const response = await apiClient.get<{ reservations: Reservation[] }>(`/api/admin/restaurants/${restaurantId}/reservations`);
  return response.data.reservations;
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation['status'],
): Promise<Reservation> {
  const response = await apiClient.patch<Reservation>(`/api/admin/reservations/${reservationId}/status`, { status });
  return response.data;
}
