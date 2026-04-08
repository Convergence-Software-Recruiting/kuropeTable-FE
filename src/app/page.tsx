'use client';

import { useMemo, useState } from 'react';
import KuropeLogo from '@/components/brand/KuropeLogo';
import CityGrid from '@/components/restaurant/CityGrid';
import PriceFilter from '@/components/restaurant/PriceFilter';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import {
  mockCities,
  mockCityMap,
  mockCountryGroups,
  mockRestaurantListings,
  serviceTrackCards,
  sortTracks,
} from '@/lib/mocks/listingData';
import { TRACK_LABELS } from '@/lib/types/listing';
import type { PriceRange, ServiceTrack } from '@/lib/types/listing';

type TrackFilter = ServiceTrack | 'all';

export default function Home(): React.ReactElement {
  const [selectedTrack, setSelectedTrack] = useState<TrackFilter>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceRange | 'all'>('all');

  const visibleCities = useMemo(
    () =>
      mockCities.filter((city) => {
        const trackMatch = selectedTrack === 'all' || city.serviceTrack === selectedTrack;
        const countryMatch = selectedCountry === 'all' || city.country === selectedCountry;
        return trackMatch && countryMatch;
      }),
    [selectedTrack, selectedCountry],
  );

  const filteredListings = useMemo(
    () =>
      mockRestaurantListings.filter((listing) => {
        const trackMatch = selectedTrack === 'all' || listing.serviceTrack === selectedTrack;
        const countryMatch = selectedCountry === 'all' || listing.country === selectedCountry;
        const cityMatch = !selectedCity || listing.cityId === selectedCity;
        const priceMatch = priceFilter === 'all' || listing.priceRange === priceFilter;
        return trackMatch && countryMatch && cityMatch && priceMatch;
      }),
    [selectedTrack, selectedCountry, selectedCity, priceFilter],
  );

  const selectedCityInfo = selectedCity ? mockCityMap.get(selectedCity) : null;
  const highlightedListing = filteredListings[0] ?? null;
  const activeTrackLabel = selectedTrack === 'all' ? '전체 실증 트랙' : TRACK_LABELS[selectedTrack];
  const activeCountryLabel =
    selectedCountry === 'all'
      ? '중부 유럽 전체'
      : mockCountryGroups.find((country) => country.code === selectedCountry)?.name ?? selectedCountry;
  const heroSummary = selectedCityInfo
    ? `${selectedCityInfo.name} ${selectedCityInfo.districtFocus} 구간을 중심으로 현장 동선을 보고 있습니다.`
    : `${activeCountryLabel} 권역에서 ${activeTrackLabel} 기준으로 우선 검토할 거점을 추렸습니다.`;
  const heroMemo = highlightedListing
    ? `${highlightedListing.name} 기준 리뷰 ${highlightedListing.reviewCount.toLocaleString()}건, 평균 체류 ${highlightedListing.avgDiningMinutes}분 흐름이 확인됩니다.`
    : '조건에 맞는 거점이 없어서 필터를 넓혀 다시 보는 편이 좋습니다.';

  const setTrackFilter = (nextTrack: TrackFilter): void => {
    setSelectedTrack(nextTrack);

    if (!selectedCity) return;
    const city = mockCityMap.get(selectedCity);
    if (!city) {
      setSelectedCity(null);
      return;
    }

    if (nextTrack !== 'all' && city.serviceTrack !== nextTrack) {
      setSelectedCity(null);
    }
  };

  const setCountryFilter = (nextCountry: string): void => {
    setSelectedCountry(nextCountry);

    if (!selectedCity) return;
    const city = mockCityMap.get(selectedCity);
    if (!city) {
      setSelectedCity(null);
      return;
    }

    if (nextCountry !== 'all' && city.country !== nextCountry) {
      setSelectedCity(null);
    }
  };

  return (
    <main className="app-shell motion-enter space-y-5">
      <header className="kurope-hero-card surface-card overflow-hidden p-5 sm:p-6">
        <div className="kurope-hero-glow" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <KuropeLogo />
            <span className="rounded-full border border-[#c7d7ef] bg-white/80 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#345981]">
              field board
            </span>
          </div>

          <h1 className="mt-4 text-[1.48rem] font-black tracking-[-0.02em] text-[var(--text-strong)] sm:text-[1.68rem]">
            유럽 실증 후보를 한 화면에서 정리하는 운영 보드
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-default)]">
            도시별 결이 다른 외식, 이동, 생활 수요를 한 번에 훑으면서 지금 바로 가볼 만한 후보를 빠르게 압축합니다.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1.35fr_0.95fr]">
            <div className="rounded-[1.1rem] border border-[#d9e4f5] bg-white/88 px-4 py-3">
              <p className="text-[0.67rem] font-bold uppercase tracking-[0.08em] text-[#5c728f]">Current Focus</p>
              <p className="mt-1 text-sm font-extrabold text-[#1d3f67]">
                {selectedCityInfo ? `${selectedCityInfo.name} 현장 흐름 확인` : `${activeCountryLabel} 후보 압축`}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#55708f]">{heroSummary}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[1.1rem] border border-[#d9e4f5] bg-white/85 px-3 py-3">
                <p className="text-[0.67rem] font-bold uppercase tracking-[0.06em] text-[#5c728f]">Visible Cities</p>
                <p className="mt-1 text-[1.08rem] font-extrabold text-[#1e3e66]">{visibleCities.length}</p>
                <p className="mt-1 text-[11px] text-[#637a96]">현재 필터에 맞는 도시</p>
              </div>
              <div className="rounded-[1.1rem] border border-[#d9e4f5] bg-white/85 px-3 py-3">
                <p className="text-[0.67rem] font-bold uppercase tracking-[0.06em] text-[#5c728f]">Shortlist</p>
                <p className="mt-1 text-[1.08rem] font-extrabold text-[#1e3e66]">{filteredListings.length}</p>
                <p className="mt-1 text-[11px] text-[#637a96]">지금 비교 중인 거점</p>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-[1.1rem] border border-[#d9e4f5] bg-white/76 px-4 py-3">
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.08em] text-[#5c728f]">Field Note</p>
            <p className="mt-1 text-sm leading-relaxed text-[#36526f]">{heroMemo}</p>
          </div>
        </div>
      </header>

      <section className="surface-card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">서비스 트랙</h2>
          {selectedTrack !== 'all' && (
            <button
              type="button"
              onClick={() => setTrackFilter('all')}
              className="text-xs font-semibold text-[var(--primary-strong)]"
            >
              전체 트랙 보기
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={[
              'rounded-2xl border px-3.5 py-3 text-left transition-colors',
              selectedTrack === 'all'
                ? 'border-[var(--primary)] bg-[#edf4ff] shadow-[0_16px_28px_-24px_rgba(47,128,255,0.75)]'
                : 'border-[var(--line)] bg-white hover:border-[#c5d5eb]',
            ].join(' ')}
          >
            <p className="text-sm font-extrabold text-[var(--text-strong)]">전체 트랙</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">모든 도시 카테고리 보기</p>
          </button>

          {serviceTrackCards.map((track) => {
            const isActive = selectedTrack === track.id;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setTrackFilter(track.id)}
                className={[
                  'rounded-2xl border px-3.5 py-3 text-left transition-colors',
                  isActive
                    ? 'border-[var(--primary)] bg-[#edf4ff] shadow-[0_16px_28px_-24px_rgba(47,128,255,0.75)]'
                    : 'border-[var(--line)] bg-white hover:border-[#c5d5eb]',
                ].join(' ')}
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm" style={{ background: track.gradient }}>
                    {track.emoji}
                  </span>
                  <p className="text-[0.87rem] font-extrabold text-[var(--text-strong)]">{track.title}</p>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">{track.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">국가별 분류</h2>
          {(selectedCountry !== 'all' || selectedCity) && (
            <button
              type="button"
              onClick={() => {
                setCountryFilter('all');
                setSelectedCity(null);
              }}
              className="text-xs font-semibold text-[var(--primary-strong)]"
            >
              분류 초기화
            </button>
          )}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setCountryFilter('all')}
            className={[
              'flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold',
              selectedCountry === 'all'
                ? 'border-[#91b7ef] bg-[#edf4ff] text-[#1f5fbf]'
                : 'border-[#d7e1f0] bg-white text-[#4a607d]',
            ].join(' ')}
          >
            전체 국가
          </button>

          {mockCountryGroups.map((country) => {
            const isActive = selectedCountry === country.code;

            return (
              <button
                key={country.code}
                type="button"
                onClick={() => setCountryFilter(country.code)}
                className={[
                  'flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold',
                  isActive
                    ? 'border-[#91b7ef] bg-[#edf4ff] text-[#1f5fbf]'
                    : 'border-[#d7e1f0] bg-white text-[#4a607d]',
                ].join(' ')}
              >
                {country.name} · {country.cityCount}개 도시 · {sortTracks(country.trackMix).map((track) => TRACK_LABELS[track]).join(' / ')}
              </button>
            );
          })}
        </div>

        {visibleCities.length > 0 ? (
          <CityGrid cities={visibleCities} selected={selectedCity} onSelect={setSelectedCity} />
        ) : (
          <p className="rounded-xl border border-[#d6dfec] bg-[#f8fbff] px-4 py-5 text-sm text-[var(--text-muted)]">
            선택한 필터에 해당하는 도시가 없습니다.
          </p>
        )}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="px-5 pt-5 sm:px-6">
          <p className="page-eyebrow">curated shortlist</p>
          <h2 className="page-title mt-1">
            {selectedCityInfo ? `${selectedCityInfo.name} 현장 후보` : '현장 검토 스폿 아카이브'}
          </h2>
          <p className="page-description">
            {filteredListings.length > 0
              ? `${filteredListings.length}곳이 현재 조건에 맞고, 카드마다 바로 확인할 포인트를 함께 붙였습니다.`
              : '조건에 맞는 검증 거점이 없습니다.'}
          </p>
        </div>

        <div className="mt-3 px-5 sm:px-6">
          <PriceFilter selected={priceFilter} onChange={setPriceFilter} />
        </div>

        {filteredListings.length > 0 ? (
          <ul className="space-y-2 px-2 pb-3 pt-3">
            {filteredListings.map((listing, index) => (
              <RestaurantCard key={listing.id} listing={listing} index={index} />
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">필터를 조정해 다른 도시 또는 트랙을 선택해 주세요.</p>
        )}
      </section>
    </main>
  );
}
