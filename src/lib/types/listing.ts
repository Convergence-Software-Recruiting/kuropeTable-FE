import type { OperatingStatus } from '@/lib/types';

export type ServiceTrack = 'catchtable' | 'rentcar' | 'grocery';
export type PriceRange = 'budget' | 'mid' | 'upscale' | 'fine';

export interface CityItem {
  id: string;
  name: string;
  country: string;
  countryName: string;
  serviceTrack: ServiceTrack;
  districtFocus: string;
  gradient: string;
  badge?: 'popular' | 'hot';
}

export interface CountryGroup {
  code: string;
  name: string;
  cityCount: number;
  trackMix: ServiceTrack[];
}

export interface ServiceTrackCard {
  id: ServiceTrack;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
}

export interface RestaurantListing {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: string;
  cityId: string;
  city: string;
  country: string;
  countryName: string;
  serviceTrack: ServiceTrack;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  distanceLabel: string;
  operatingHours: string;
  heroGradient: string;
  thumbGradient: string;
  features: string[];
  operatingStatus: OperatingStatus;
  reservationEnabled: boolean;
  waitingEnabled: boolean;
  remoteWaitingEnabled: boolean;
  onsiteCheckThreshold: number;
  avgDiningMinutes: number;
}

export const PRICE_LABELS: Record<PriceRange, string> = {
  budget: '€ 25 이하',
  mid: '€ 25–60',
  upscale: '€ 60–120',
  fine: '€ 120 이상',
};

export const TRACK_LABELS: Record<ServiceTrack, string> = {
  catchtable: '유럽형 캐치테이블',
  rentcar: '렌트카 통합 이동',
  grocery: '유럽형 마켓컬리',
};

export const TRACK_SHORT_LABELS: Record<ServiceTrack, string> = {
  catchtable: '식당 예약',
  rentcar: '광역 이동',
  grocery: '생활 장보기',
};

export const BADGE_LABELS: Record<NonNullable<CityItem['badge']>, string> = {
  popular: '인기',
  hot: '급상승',
};
