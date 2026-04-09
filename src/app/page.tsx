'use client';

import { useMemo, useState } from 'react';
import KuropeLogo from '@/components/brand/KuropeLogo';
import CityGrid from '@/components/restaurant/CityGrid';
import PriceFilter from '@/components/restaurant/PriceFilter';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { mockCities, mockCityMap, mockCountryGroups, mockRestaurantListings, serviceTrackCards } from '@/lib/mocks/listingData';
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
  const activeTrackLabel = selectedTrack === 'all' ? '전체 트랙' : TRACK_LABELS[selectedTrack];
  const activeCountryLabel =
    selectedCountry === 'all'
      ? '동유럽'
      : mockCountryGroups.find((country) => country.code === selectedCountry)?.name ?? selectedCountry;

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
    <main className="app-shell motion-enter space-y-4">
      <header className="surface-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <KuropeLogo />
          <span className="rounded-full border border-[#d6e1f0] bg-[#f7faff] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#46648a]">
            운영 보드
          </span>
        </div>

        <h1 className="mt-4 text-[1.35rem] font-black tracking-[-0.02em] text-[var(--text-strong)] sm:text-[1.5rem]">K-SPEED in Europe</h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">도시별 리서치 결과를 기반으로 3개 서비스 트랙의 우선 검증 후보를 빠르게 정리합니다.</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-[#dbe5f3] bg-[#fafcff] px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6e8199]">현재 범위</p>
            <p className="mt-1 text-sm font-extrabold text-[#274a74]">{activeCountryLabel}</p>
          </div>
          <div className="rounded-xl border border-[#dbe5f3] bg-[#fafcff] px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6e8199]">선택 트랙</p>
            <p className="mt-1 text-sm font-extrabold text-[#274a74]">{activeTrackLabel}</p>
          </div>
        </div>
      </header>

      <section className="surface-card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">서비스 트랙</h2>
          {selectedTrack !== 'all' && (
            <button type="button" onClick={() => setTrackFilter('all')} className="text-xs font-semibold text-[var(--primary-strong)]">
              초기화
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={[
              'rounded-2xl border px-3.5 py-3 text-left transition-all',
              selectedTrack === 'all'
                ? 'border-[#91b7ef] bg-[#edf4ff] shadow-[0_16px_30px_-25px_rgba(45,108,206,0.72)]'
                : 'border-[#d7e1f0] bg-white hover:border-[#c2d3ea]',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6f95d7,#3d6cb9)] text-sm text-white">
                ◎
              </span>
              <p className="text-sm font-extrabold text-[var(--text-strong)]">전체 트랙</p>
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">캐치테이블 · 렌트카 · 마켓컬리 전체 비교</p>
          </button>
          {serviceTrackCards.map((track) => {
            const isActive = selectedTrack === track.id;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setTrackFilter(track.id)}
                className={[
                  'rounded-2xl border px-3.5 py-3 text-left transition-all',
                  isActive
                    ? 'border-[#91b7ef] bg-[#edf4ff] shadow-[0_16px_30px_-25px_rgba(45,108,206,0.72)]'
                    : 'border-[#d7e1f0] bg-white hover:border-[#c2d3ea]',
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm text-white" style={{ background: track.gradient }}>
                    {track.emoji}
                  </span>
                  <p className="text-sm font-extrabold text-[var(--text-strong)]">{track.title}</p>
                </div>
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">{track.subtitle}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">도시 필터</h2>
          {(selectedCountry !== 'all' || selectedCity) && (
            <button
              type="button"
              onClick={() => {
                setCountryFilter('all');
                setSelectedCity(null);
              }}
              className="text-xs font-semibold text-[var(--primary-strong)]"
            >
              초기화
            </button>
          )}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setCountryFilter('all')}
            className={[
              'flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold',
              selectedCountry === 'all' ? 'border-[#91b7ef] bg-[#edf4ff] text-[#1f5fbf]' : 'border-[#d7e1f0] bg-white text-[#4a607d]',
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
                  isActive ? 'border-[#91b7ef] bg-[#edf4ff] text-[#1f5fbf]' : 'border-[#d7e1f0] bg-white text-[#4a607d]',
                ].join(' ')}
              >
                {country.name} · {country.cityCount}개
              </button>
            );
          })}
        </div>

        <p className="mb-3 text-xs text-[var(--text-muted)]">
          {selectedCityInfo
            ? `${selectedCityInfo.name} 선택됨`
            : `${activeCountryLabel} / ${activeTrackLabel} 기준으로 ${visibleCities.length}개 도시 표시 중`}
        </p>

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
          <p className="page-eyebrow">우선 검토 목록</p>
          <h2 className="page-title mt-1">{selectedCityInfo ? `${selectedCityInfo.name} 후보` : '도시별 후보 목록'}</h2>
          <p className="page-description">
            {filteredListings.length > 0
              ? `${filteredListings.length}곳이 현재 조건에 맞습니다.`
              : '조건에 맞는 후보가 없습니다.'}
          </p>
        </div>

        <div className="mt-3 px-5 sm:px-6">
          <PriceFilter selected={priceFilter} onChange={setPriceFilter} />
        </div>

        {filteredListings.length > 0 ? (
          <ul className="space-y-2 px-3 pb-4 pt-3 sm:px-4">
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
