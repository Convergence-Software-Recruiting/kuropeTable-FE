'use client';

import Link from 'next/link';
import type { Restaurant } from '@/lib/types';
import { mockRestaurantListingMap } from '@/lib/mocks/listingData';
import { PRICE_LABELS, TRACK_LABELS, TRACK_SHORT_LABELS } from '@/lib/types/listing';
import { getSpotHeroImagePath } from '@/lib/utils/imagePaths';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  restaurant: Restaurant;
}

const TRACK_PILL_CLASS = {
  catchtable: 'border-[#ffd4b3] bg-[#fff1e8] text-[#b65a1e]',
  rentcar: 'border-[#b7e9da] bg-[#eafbf6] text-[#0f7662]',
  grocery: 'border-[#c7d9ff] bg-[#edf3ff] text-[#2852a0]',
} as const;

const TRACK_ACTION_LABELS = {
  catchtable: { reservation: '예약하기', waiting: '대기 현황 보기', waitingRegister: '웨이팅 등록' },
  rentcar: { reservation: '차량 예약 신청', waiting: '현장 접수 현황', waitingRegister: '현장 접수 등록' },
  grocery: { reservation: '픽업 슬롯 문의', waiting: '혼잡도 보기', waitingRegister: '현장 수령 등록' },
} as const;

export default function RestaurantDetail({ restaurant }: Props): React.ReactElement {
  const listing = mockRestaurantListingMap.get(restaurant.id);
  const serviceTrack = listing?.serviceTrack ?? 'catchtable';
  const actionLabels = TRACK_ACTION_LABELS[serviceTrack];
  const isClosed = restaurant.operating_status === 'CLOSED';

  return (
    <main className="app-shell motion-enter space-y-4">
      <section className="surface-card overflow-hidden">
        <div
          className="relative p-6 sm:p-8"
          style={{
            backgroundImage: listing
              ? `url(${getSpotHeroImagePath(listing.id)}), ${listing.heroGradient}`
              : 'linear-gradient(135deg,#edf4ff,#f8fbff)',
            backgroundSize: listing ? 'cover, auto' : undefined,
            backgroundPosition: listing ? 'center, center' : undefined,
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.96)_100%)]" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-2">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-[#ccdaef] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#365981]"
              >
                ← 메인으로
              </Link>

              <StatusBadge status={restaurant.operating_status} />
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${TRACK_PILL_CLASS[serviceTrack]}`}>
                {TRACK_SHORT_LABELS[serviceTrack]}
              </span>
              <span className="rounded-full border border-[#d5deeb] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#50647e]">
                {TRACK_LABELS[serviceTrack]}
              </span>
              {listing && (
                <span className="rounded-full border border-[#d5deeb] bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#50647e]">
                  {PRICE_LABELS[listing.priceRange]}
                </span>
              )}
            </div>

            <h1 className="page-title leading-tight">{restaurant.name}</h1>

            <p className="mt-2 text-sm leading-relaxed text-[#3e5774]">
              {listing?.summary ?? '현지 운영 방식과 사용자 경험을 함께 검증하는 핵심 거점입니다.'}
            </p>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-[#d8e3f2] bg-white/92 px-3.5 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5a718f]">평점/리뷰</p>
                <p className="mt-1 text-sm font-bold text-[var(--text-strong)]">
                  {listing ? `${listing.rating.toFixed(1)}점 · 리뷰 ${listing.reviewCount.toLocaleString()}개` : '데이터 준비 중'}
                </p>
              </div>
              <div className="rounded-xl border border-[#d8e3f2] bg-white/92 px-3.5 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5a718f]">운영 시간</p>
                <p className="mt-1 text-sm font-bold text-[var(--text-strong)]">{listing?.operatingHours ?? '운영 시간 미정'}</p>
              </div>
              <div className="rounded-xl border border-[#d8e3f2] bg-white/92 px-3.5 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5a718f]">접근 정보</p>
                <p className="mt-1 text-sm font-bold text-[var(--text-strong)]">{listing?.distanceLabel ?? '도심 접근 가능'}</p>
              </div>
              <div className="rounded-xl border border-[#d8e3f2] bg-white/92 px-3.5 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5a718f]">평균 체류</p>
                <p className="mt-1 text-sm font-bold text-[var(--text-strong)]">{restaurant.avg_dining_minutes}분</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">설명</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-default)]">{restaurant.description}</p>
          </div>

          {listing?.features && listing.features.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">핵심 체크 포인트</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {listing.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-[#d5deeb] bg-[#f7faff] px-2.5 py-1 text-[11px] font-semibold text-[#405877]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface-soft rounded-xl px-4 py-3 text-sm text-[var(--text-default)]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">주소</p>
              <p className="mt-1 font-semibold text-[var(--text-strong)]">{restaurant.city} · {restaurant.address}</p>
            </div>
            <div className="surface-soft rounded-xl px-4 py-3 text-sm text-[var(--text-default)]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">문의 전화</p>
              <p className="mt-1 font-semibold text-[var(--text-strong)]">{restaurant.phone}</p>
            </div>
          </div>

          <div className="surface-soft rounded-xl px-4 py-3 text-sm text-[var(--text-default)]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">서비스 상태</p>
            <p className="mt-1 font-semibold text-[var(--text-strong)]">
              예약 {restaurant.reservation_enabled ? '가능' : '불가'} · 웨이팅 {restaurant.waiting_enabled ? '가능' : '불가'}
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card motion-enter motion-enter-delay-1 p-5 sm:p-6">
        <p className="mb-4 text-sm font-semibold text-[var(--text-strong)]">바로 진행하기</p>
        <div className="flex flex-col gap-2.5">
          {restaurant.reservation_enabled ? (
            <Link href={`/restaurants/${restaurant.id}/reservation/new`}>
              <Button fullWidth disabled={isClosed}>
                {actionLabels.reservation}
              </Button>
            </Link>
          ) : (
            <Button fullWidth disabled aria-label="예약 불가">
              예약 불가
            </Button>
          )}

          {restaurant.waiting_enabled && (
            <>
              <Link href={`/restaurants/${restaurant.id}/waiting`}>
                <Button variant="secondary" fullWidth>
                  {actionLabels.waiting}
                </Button>
              </Link>
              {restaurant.remote_waiting_enabled && !isClosed && (
                <Link href={`/restaurants/${restaurant.id}/waiting/new`}>
                  <Button variant="ghost" fullWidth>
                    {actionLabels.waitingRegister}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
