import type { CreateWaitingInput, Waiting, WaitingStatusResponse } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

export async function getRestaurantWaitings(restaurantId: string): Promise<{ waitings: Waiting[]; total_count: number }> {
  const response = await apiClient.get<{ waitings: Waiting[]; total_count: number }>(`/api/restaurants/${restaurantId}/waiting`);
  return response.data;
}

export async function createWaiting(restaurantId: string, input: CreateWaitingInput): Promise<Waiting> {
  const response = await apiClient.post<Waiting>(`/api/restaurants/${restaurantId}/waiting`, input);
  return response.data;
}

export async function getMyWaiting(waitingId: string): Promise<WaitingStatusResponse> {
  const response = await apiClient.get<WaitingStatusResponse>(`/api/waiting/${waitingId}`);
  return response.data;
}

export async function cancelWaiting(waitingId: string): Promise<Waiting> {
  const response = await apiClient.patch<Waiting>(`/api/waiting/${waitingId}/cancel`);
  return response.data;
}

export async function callWaiting(waitingId: string): Promise<Waiting> {
  const response = await apiClient.patch<Waiting>(`/api/waiting/${waitingId}/call`);
  return response.data;
}

export async function seatWaiting(waitingId: string): Promise<Waiting> {
  const response = await apiClient.patch<Waiting>(`/api/waiting/${waitingId}/seat`);
  return response.data;
}
