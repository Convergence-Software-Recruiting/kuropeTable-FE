import type { Restaurant } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getRestaurant(id: string): Promise<Restaurant> {
  const res = await fetch(`${BASE}/api/restaurants/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch restaurant: ${res.status}`);
  return res.json() as Promise<Restaurant>;
}
