import type { CreateWaitingInput, Waiting, WaitingStatusResponse } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getRestaurantWaitings(restaurantId: string): Promise<{ waitings: Waiting[]; total_count: number }> {
  const res = await fetch(`${BASE}/api/restaurants/${restaurantId}/waiting`);
  if (!res.ok) throw new Error(`Failed to fetch waitings: ${res.status}`);
  return res.json() as Promise<{ waitings: Waiting[]; total_count: number }>;
}

export async function createWaiting(restaurantId: string, input: CreateWaitingInput): Promise<Waiting> {
  const res = await fetch(`${BASE}/api/restaurants/${restaurantId}/waiting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create waiting: ${res.status}`);
  return res.json() as Promise<Waiting>;
}

export async function getMyWaiting(waitingId: string): Promise<WaitingStatusResponse> {
  const res = await fetch(`${BASE}/api/waiting/${waitingId}`);
  if (!res.ok) throw new Error(`Failed to fetch waiting: ${res.status}`);
  return res.json() as Promise<WaitingStatusResponse>;
}

export async function cancelWaiting(waitingId: string): Promise<Waiting> {
  const res = await fetch(`${BASE}/api/waiting/${waitingId}/cancel`, { method: 'PATCH' });
  if (!res.ok) throw new Error(`Failed to cancel waiting: ${res.status}`);
  return res.json() as Promise<Waiting>;
}

export async function callWaiting(waitingId: string): Promise<Waiting> {
  const res = await fetch(`${BASE}/api/waiting/${waitingId}/call`, { method: 'PATCH' });
  if (!res.ok) throw new Error(`Failed to call waiting: ${res.status}`);
  return res.json() as Promise<Waiting>;
}

export async function seatWaiting(waitingId: string): Promise<Waiting> {
  const res = await fetch(`${BASE}/api/waiting/${waitingId}/seat`, { method: 'PATCH' });
  if (!res.ok) throw new Error(`Failed to seat waiting: ${res.status}`);
  return res.json() as Promise<Waiting>;
}
