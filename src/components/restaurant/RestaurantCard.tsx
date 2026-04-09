import Link from 'next/link';
import type { RestaurantListing } from '@/lib/types/listing';
import { PRICE_LABELS, TRACK_SHORT_LABELS } from '@/lib/types/listing';
import { getSpotThumbImagePath } from '@/lib/utils/imagePaths';

interface Props {
  listing: RestaurantListing;
  index?: number;
}

const trackPillClass: Record<RestaurantListing['serviceTrack'], string> = {
  catchtable: 'bg-[#fff1e8] text-[#b65a1e] border-[#ffd4b3]',
  rentcar: 'bg-[#eafbf6] text-[#0f7662] border-[#b7e9da]',
  grocery: 'bg-[#edf3ff] text-[#2852a0] border-[#c7d9ff]',
};

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

export default function RestaurantCard({ listing, index = 0 }: Props): React.ReactElement {
  return (
    <li
      className="motion-enter"
      style={{
        animationDelay: `${Math.min(index, 8) * 35}ms`,
      }}
    >
      <Link
        href={`/restaurants/${listing.id}`}
        className="group grid grid-cols-[88px_1fr] gap-3 rounded-2xl border border-[var(--line)] bg-white p-3 transition-colors hover:border-[#c6d5ea]"
      >
        <div
          className="h-[100px] w-[88px] overflow-hidden rounded-xl"
          style={{
            backgroundImage: `url(${getSpotThumbImagePath(listing.id)}), ${listing.thumbGradient}`,
            backgroundSize: 'cover, auto',
            backgroundPosition: 'center, center',
          }}
        />

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-[0.95rem] font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">{listing.name}</p>
            <span className="rounded-full bg-[#f2f6ff] px-2 py-0.5 text-[10px] font-bold text-[#345c97]">{PRICE_LABELS[listing.priceRange]}</span>
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">{listing.summary}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <StarRating value={listing.rating} />
            <span className="text-[11px] text-[var(--text-muted)]">리뷰 {listing.reviewCount.toLocaleString()}</span>
            <span className="text-[11px] text-[var(--text-muted)]">{listing.city}</span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${trackPillClass[listing.serviceTrack]}`}>
              {TRACK_SHORT_LABELS[listing.serviceTrack]}
            </span>
            <span className="rounded-full border border-[#d6dfed] bg-[#f8faff] px-2 py-0.5 text-[10px] font-semibold text-[#50647e]">
              체류 {listing.avgDiningMinutes}분
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
