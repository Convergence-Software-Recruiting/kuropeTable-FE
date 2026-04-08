'use client';

import Link from 'next/link';
import type { Restaurant } from '@/lib/types';
import { mockRestaurantListingMap } from '@/lib/mocks/listingData';
import { getCatchtableVenueUiData } from '@/lib/mocks/catchtableUiData';
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

function FacilityIcon({ icon }: { icon: string }): React.ReactElement {
  const base = 'h-6 w-6 text-[#1f2f40]';

  if (icon === 'parking') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="4" y="3.5" width="16" height="17" rx="3" />
        <path d="M9 17V7h4.8a3 3 0 0 1 0 6H9" />
      </svg>
    );
  }
  if (icon === 'valet') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 14h18M6 14l1.4-4.2A2 2 0 0 1 9.3 8.5h5.4a2 2 0 0 1 1.9 1.3L18 14" />
        <circle cx="7.5" cy="16.8" r="1.3" />
        <circle cx="16.5" cy="16.8" r="1.3" />
      </svg>
    );
  }
  if (icon === 'corkage') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M7 3.5h4v5H7zM9 8.5V20M15 4.5h2.5a2 2 0 0 1 0 4H15V20" />
      </svg>
    );
  }
  if (icon === 'lettering') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
        <path d="M8 15l2.6-6h2.8L16 15M9 13h5" />
      </svg>
    );
  }
  if (icon === 'private_room') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="4" y="5" width="16" height="13" rx="2" />
        <path d="M7 9.5h10M9 18v2M15 18v2" />
      </svg>
    );
  }
  if (icon === 'sommelier') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M7 4h6v3a3 3 0 0 1-6 0V4ZM10 10v7M8 20h4" />
        <path d="M16 4h4v2a3 3 0 0 1-3 3h0a3 3 0 0 1-1-0.2V4Z" />
      </svg>
    );
  }
  if (icon === 'wifi') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3.5 9.5a13.5 13.5 0 0 1 17 0M6.5 13a9 9 0 0 1 11 0M9.5 16.5a4.5 4.5 0 0 1 5 0M12 20h0" />
      </svg>
    );
  }

  return (
    <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export default function RestaurantDetail({ restaurant }: Props): React.ReactElement {
  const listing = mockRestaurantListingMap.get(restaurant.id);
  const serviceTrack = listing?.serviceTrack ?? 'catchtable';
  const actionLabels = TRACK_ACTION_LABELS[serviceTrack];
  const isClosed = restaurant.operating_status === 'CLOSED';
  const catchtableUi = serviceTrack === 'catchtable' && listing ? getCatchtableVenueUiData(listing.id) : null;

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
          {catchtableUi ? (
            <>
              <section className="surface-soft rounded-2xl px-5 py-5">
                <p className="text-[1.7rem] font-black tracking-[-0.02em] text-[#0f1720]">예약 오픈 일정</p>
                <p className="mt-3 text-[1.28rem] font-black text-[#ff4d15]">◷ {catchtableUi.openSchedule.reservationOpenAt}</p>
                <p className="mt-1 text-[1.02rem] font-semibold text-[#3a4654]">{catchtableUi.openSchedule.reservationRange}</p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl border border-[#ff4d15] bg-white px-5 py-3 text-[1.35rem] font-extrabold text-[#ff4d15]"
                >
                  {catchtableUi.openSchedule.actionLabel}
                </button>
              </section>

              <section className="surface-soft rounded-2xl px-5 py-5">
                <p className="text-[1.7rem] font-black tracking-[-0.02em] text-[#0f1720]">소식</p>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {catchtableUi.news.map((item) => (
                    <article
                      key={item.id}
                      className="w-[280px] flex-shrink-0 rounded-2xl border border-[#d8dee7] bg-white px-4 py-3.5"
                    >
                      <p className="text-sm font-bold text-[#13a59b]">📣 소식</p>
                      <p className="mt-2 text-[1.22rem] font-black tracking-[-0.02em] text-[#1a232f]">{item.title}</p>
                      <p className="mt-1 text-[1.02rem] font-semibold text-[#4e5a68]">{item.publishedLabel}</p>
                      <p className="mt-1 line-clamp-2 text-[1rem] text-[#5f6d7b]">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="surface-soft rounded-2xl px-5 py-5">
                <p className="text-[1.7rem] font-black tracking-[-0.02em] text-[#0f1720]">편의시설</p>
                <div className="mt-4 grid grid-cols-3 gap-y-5 sm:grid-cols-4">
                  {catchtableUi.facilities.map((facility) => (
                    <div key={facility.id} className="flex flex-col items-center gap-2 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#d7dee8] bg-white">
                        <FacilityIcon icon={facility.icon} />
                      </div>
                      <p className="text-[1rem] font-semibold text-[#1f2c39]">{facility.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2.5">
                {catchtableUi.guideSections.map((guide) => (
                  <div key={guide.id} className="surface-soft rounded-2xl px-4 py-3">
                    <p className="text-[1.18rem] font-black text-[#101b28]">{guide.title}</p>
                    <div className="mt-2 space-y-1.5">
                      {guide.points.map((point) => (
                        <p key={point} className="text-[0.98rem] font-medium text-[#4b5c6e]">
                          ✓ {point}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            </>
          ) : (
            <>
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
            </>
          )}
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
