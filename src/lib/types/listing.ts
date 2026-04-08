export type PriceRange = 'budget' | 'mid' | 'upscale' | 'fine';

export interface RestaurantListing {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  city: string;
  country: string;
  rating: number;
  review_count: number;
  price_range: PriceRange;
  reservation_enabled: boolean;
  waiting_enabled: boolean;
}

export interface CityItem {
  id: string;
  name: string;
  country: string;
  gradient: string;
  badge?: 'popular' | 'trending';
}

export const PRICE_LABELS: Record<PriceRange, string> = {
  budget: '€ 30 이하',
  mid: '€ 30–60',
  upscale: '€ 60–100',
  fine: '€ 100 이상',
};
