import type { Restaurant } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

export async function getRestaurant(id: string): Promise<Restaurant> {
  const response = await apiClient.get<Restaurant>(`/api/restaurants/${id}`);
  return response.data;
}
