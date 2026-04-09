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

export type CatchtableTagTone = 'sand' | 'rose' | 'mint';
export type CatchtableDayState = 'AVAILABLE' | 'SOLD_OUT' | 'CLOSED' | 'PHONE_ONLY';
export type CatchtableFacilityIcon =
  | 'parking'
  | 'valet'
  | 'corkage'
  | 'lettering'
  | 'private_room'
  | 'sommelier'
  | 'wifi'
  | 'wheelchair';

export interface CatchtablePromoTag {
  id: string;
  label: string;
  tone: CatchtableTagTone;
}

export interface CatchtableOperatingMeta {
  statusLabel: string;
  nextOpenAt: string;
  lunchPriceLabel: string;
  dinnerPriceLabel: string;
}

export interface CatchtableDailyStatus {
  date: string;
  dayLabel: string;
  shortLabel: string;
  state: CatchtableDayState;
  note: string;
}

export interface CatchtableOpenSchedule {
  reservationOpenAt: string;
  reservationRange: string;
  actionLabel: string;
}

export interface CatchtableNewsItem {
  id: string;
  title: string;
  summary: string;
  publishedLabel: string;
}

export interface CatchtableFacility {
  id: string;
  label: string;
  icon: CatchtableFacilityIcon;
}

export interface CatchtableGuideSection {
  id: string;
  title: string;
  points: string[];
}

export interface CatchtableCalendarDay {
  date: string;
  dayNumber: number;
  inMonth: boolean;
  enabled: boolean;
}

export interface CatchtablePartySchedule {
  partySize: number;
  slots: string[];
  phoneOnlyNotice?: string;
}

export interface CatchtableVenueUiData {
  listingId: string;
  promotionTags: CatchtablePromoTag[];
  paymentNotice: string;
  areaLabel: string;
  cuisineLabel: string;
  galleryItems: string[];
  operatingMeta: CatchtableOperatingMeta;
  weeklyStatus: CatchtableDailyStatus[];
  openSchedule: CatchtableOpenSchedule;
  news: CatchtableNewsItem[];
  facilities: CatchtableFacility[];
  guideSections: CatchtableGuideSection[];
  calendarMonthLabel: string;
  calendarDays: CatchtableCalendarDay[];
  partySchedules: CatchtablePartySchedule[];
}

export const PRICE_LABELS: Record<PriceRange, string> = {
  budget: '€ 25 이하',
  mid: '€ 25–60',
  upscale: '€ 60–120',
  fine: '€ 120 이상',
};

export const TRACK_LABELS: Record<ServiceTrack, string> = {
  catchtable: '캐치테이블',
  rentcar: '렌트카',
  grocery: '마켓컬리',
};

export const TRACK_SHORT_LABELS: Record<ServiceTrack, string> = {
  catchtable: '캐치테이블',
  rentcar: '렌트카',
  grocery: '마켓컬리',
};

export const BADGE_LABELS: Record<NonNullable<CityItem['badge']>, string> = {
  popular: '인기',
  hot: '급상승',
};
