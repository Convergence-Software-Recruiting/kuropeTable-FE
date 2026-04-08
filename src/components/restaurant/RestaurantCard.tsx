import Link from 'next/link';
import type { RestaurantListing } from '@/lib/types/listing';
import { PRICE_LABELS, TRACK_SHORT_LABELS } from '@/lib/types/listing';
import { getSpotThumbImagePath } from '@/lib/utils/imagePaths';
import { getCatchtableVenueUiData } from '@/lib/mocks/catchtableUiData';

interface Props {
  listing: RestaurantListing;
  index?: number;
}

const FLAG: Record<string, string> = {
  DE: '🇩🇪',
  CZ: '🇨🇿',
  AT: '🇦🇹',
  HU: '🇭🇺',
};

const trackPillClass: Record<RestaurantListing['serviceTrack'], string> = {
  catchtable: 'bg-[#fff1e8] text-[#b65a1e] border-[#ffd4b3]',
  rentcar: 'bg-[#eafbf6] text-[#0f7662] border-[#b7e9da]',
  grocery: 'bg-[#edf3ff] text-[#2852a0] border-[#c7d9ff]',
};

const promoTagClass = {
  sand: 'border-[#e9deca] bg-[#f8f3e6] text-[#7f5927]',
  rose: 'border-[#f0d7d7] bg-[#fdf0f0] text-[#af3535]',
  mint: 'border-[#d3ece4] bg-[#ecf8f4] text-[#187a61]',
} as const;

const dayChipClass = {
  AVAILABLE: 'border-[#d2dae5] bg-white text-[#1e2937]',
  SOLD_OUT: 'border-[#d6dde7] bg-[#f3f5f8] text-[#8190a3]',
  CLOSED: 'border-[#d8dfe8] bg-[#eff2f6] text-[#9aa4b2]',
  PHONE_ONLY: 'border-[#d6dde7] bg-white text-[#2f4c73]',
} as const;

const galleryFallbacks = [
  'linear-gradient(130deg,#e8d9bb,#ad8a66)',
  'linear-gradient(130deg,#8554e7,#c5419e)',
  'linear-gradient(130deg,#5caec3,#20425a)',
] as const;

function getVisitSignal(listing: RestaurantListing): string {
  if (listing.serviceTrack === 'catchtable') {
    return listing.waitingEnabled ? `현장 대기 ${listing.onsiteCheckThreshold}팀 이상 확인` : '예약 중심 운영';
  }

  if (listing.serviceTrack === 'rentcar') {
    return listing.reservationEnabled ? '사전 예약 전환 체크' : '현장 인수 동선 확인';
  }

  return listing.remoteWaitingEnabled ? '픽업 혼잡도 체크' : '생활권 방문 밀도 확인';
}

function getBestTiming(listing: RestaurantListing): string {
  if (listing.serviceTrack === 'catchtable') return '18:00 이후 체류 밀도 상승';
  if (listing.serviceTrack === 'rentcar') return '오전 픽업 수요 집중';
  return '주거권 오후 재방문 비중';
}

function StarRating({ value }: { value: number }): React.ReactElement {
  return (
    <span className="inline-flex items-center gap-1">
      <svg className="h-3.5 w-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
      <span className="text-[0.8rem] font-bold text-[var(--text-strong)]">{value.toFixed(1)}</span>
    </span>
  );
}

function CatchtableRestaurantCard({ listing }: { listing: RestaurantListing }): React.ReactElement {
  const ui = getCatchtableVenueUiData(listing.id);

  if (!ui) {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-white p-4">
        <p className="text-sm font-bold text-[var(--text-strong)]">{listing.name}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#e0e5ec] bg-white p-4 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.45)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {ui.promotionTags.map((tag) => (
            <span key={tag.id} className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${promoTagClass[tag.tone]}`}>
              {tag.label}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="저장"
          className="rounded-full p-1.5 text-[#203246] transition-colors hover:bg-[#f2f5f9]"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M6 3.5h8A1.5 1.5 0 0 1 15.5 5v11.2l-5.5-2.8-5.5 2.8V5A1.5 1.5 0 0 1 6 3.5Z" />
          </svg>
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-[2rem] font-black tracking-[-0.025em] text-[#1b232f]">{listing.name}</p>
        <span className="text-[1.03rem] font-bold text-[#ff4d15]">{ui.paymentNotice}</span>
      </div>

      <p className="mt-1.5 text-[1.06rem] font-semibold text-[#3e4652]">
        <span className="text-[#f6b500]">★</span> {listing.rating.toFixed(1)} ({listing.reviewCount.toLocaleString()}) · {ui.areaLabel} · {ui.cuisineLabel}
      </p>

      <div className="mt-3 grid h-[182px] grid-cols-3 overflow-hidden rounded-2xl border border-[#e4e8ee]">
        {ui.galleryItems.slice(0, 3).map((item, idx) => (
          <div
            key={item}
            className={idx === 1 ? 'border-x border-white/30' : ''}
            style={{
              backgroundImage: idx === 0 ? `url(${getSpotThumbImagePath(listing.id)}), ${galleryFallbacks[idx]}` : galleryFallbacks[idx],
              backgroundPosition: 'center, center',
              backgroundSize: 'cover, cover',
            }}
          />
        ))}
      </div>

      <div className="mt-3 space-y-1.5 text-[1rem] text-[#202a36]">
        <p className="font-semibold">◔ {ui.operatingMeta.statusLabel} · {ui.operatingMeta.nextOpenAt}</p>
        <p className="font-semibold">₩ {ui.operatingMeta.lunchPriceLabel} · {ui.operatingMeta.dinnerPriceLabel}</p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ui.weeklyStatus.map((day) => (
          <div key={day.date} className={`rounded-2xl border px-2.5 py-2 text-center ${dayChipClass[day.state]}`}>
            <p className="text-[0.74rem] font-extrabold">{day.dayLabel}</p>
            <p className="mt-1 text-[0.72rem] font-semibold">{day.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RestaurantCard({ listing, index = 0 }: Props): React.ReactElement {
  const isCatchtable = listing.serviceTrack === 'catchtable' && Boolean(getCatchtableVenueUiData(listing.id));

  return (
    <li
      className="motion-enter"
      style={{
        animationDelay: `${Math.min(index, 8) * 40}ms`,
      }}
    >
      <Link
        href={`/restaurants/${listing.id}`}
        className="group block transition-all duration-200 hover:-translate-y-0.5"
      >
        {isCatchtable ? (
          <CatchtableRestaurantCard listing={listing} />
        ) : (
        <div className="flex items-start gap-3.5">
          <div
            className="relative h-[132px] w-[104px] flex-shrink-0 overflow-hidden rounded-[1.1rem]"
            style={{
              backgroundImage: `url(${getSpotThumbImagePath(listing.id)}), ${listing.thumbGradient}`,
              backgroundSize: 'cover, auto',
              backgroundPosition: 'center, center',
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(15,28,43,0.32)_100%)]" />
            <span className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[#294766]">
              {listing.distanceLabel}
            </span>
            <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white/88">{listing.country}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="line-clamp-1 text-[0.96rem] font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">{listing.name}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7387a0]">
                  {listing.category}
                </p>
              </div>
              <span className="rounded-full bg-[#f2f6ff] px-2 py-0.5 text-[10px] font-bold text-[#345c97]">{PRICE_LABELS[listing.priceRange]}</span>
            </div>

            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">{listing.summary}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <StarRating value={listing.rating} />
              <span className="text-[11px] text-[var(--text-muted)]">리뷰 {listing.reviewCount.toLocaleString()}</span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {FLAG[listing.country] ?? ''} {listing.city}
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${trackPillClass[listing.serviceTrack]}`}>
                {TRACK_SHORT_LABELS[listing.serviceTrack]}
              </span>
              <span className="rounded-full border border-[#d6dfed] bg-[#f8faff] px-2 py-0.5 text-[10px] font-semibold text-[#50647e]">
                체류 {listing.avgDiningMinutes}분
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-[#dbe5f2] bg-[#f8fbff] px-2.5 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6c819a]">체크 포인트</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#405877]">{getVisitSignal(listing)}</p>
              </div>
              <div className="rounded-xl border border-[#dbe5f2] bg-[#fcfdff] px-2.5 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6c819a]">추천 관찰 시간</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#405877]">{getBestTiming(listing)}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#edf2f8] pt-3">
              <p className="text-[11px] font-semibold text-[#60748d]">{listing.operatingHours}</p>
              <span className="text-xs font-extrabold text-[#264e84] transition-transform duration-200 group-hover:translate-x-0.5">
                상세 보기 →
              </span>
            </div>
          </div>
        </div>
        )}
      </Link>
    </li>
  );
}
