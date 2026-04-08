'use client';

import { useState } from 'react';
import CityGrid from '@/components/restaurant/CityGrid';
import PriceFilter from '@/components/restaurant/PriceFilter';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { mockCities, mockRestaurantListings } from '@/lib/mocks/listingData';
import type { PriceRange } from '@/lib/types/listing';

export default function Home(): React.ReactElement {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceRange | 'all'>('all');

  const filtered = mockRestaurantListings.filter((r) => {
    const cityMatch = !selectedCity || r.city.toLowerCase() === selectedCity;
    const priceMatch = priceFilter === 'all' || r.price_range === priceFilter;
    return cityMatch && priceMatch;
  });

  return (
    <main className="app-shell motion-enter space-y-5">

      {/* 어디로 가시나요? */}
      <section className="surface-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--text-strong)]">어느 도시로 가시나요?</h2>
          {selectedCity && (
            <button
              onClick={() => setSelectedCity(null)}
              className="text-xs font-semibold text-[var(--primary-strong)]"
            >
              전체 보기
            </button>
          )}
        </div>
        <CityGrid
          cities={mockCities}
          selected={selectedCity}
          onSelect={setSelectedCity}
        />
      </section>

      {/* 가격대별 BEST */}
      <section className="surface-card overflow-hidden">
        <div className="px-5 pt-5 sm:px-6">
          <p className="page-eyebrow">best restaurants</p>
          <h2 className="page-title mt-1">
            {selectedCity
              ? `${mockCities.find((c) => c.id === selectedCity)?.name ?? ''} 추천`
              : '가격대별 BEST'}
          </h2>
          <p className="page-description">
            {filtered.length > 0
              ? `${filtered.length}개의 레스토랑`
              : '조건에 맞는 레스토랑이 없습니다.'}
          </p>
        </div>

        <div className="mt-4 px-5 sm:px-6">
          <PriceFilter selected={priceFilter} onChange={setPriceFilter} />
        </div>

        {filtered.length > 0 ? (
          <ul className="divide-y divide-[var(--line)] px-2 pb-2">
            {filtered.map((r, i) => (
              <RestaurantCard key={r.id} listing={r} index={i} />
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--text-muted)]">
            선택한 조건에 맞는 레스토랑이 없습니다.
          </p>
        )}
      </section>

    </main>
  );
}
