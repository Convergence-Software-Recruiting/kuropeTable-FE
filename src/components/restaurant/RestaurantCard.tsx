import Link from 'next/link';
import type { RestaurantListing } from '@/lib/types/listing';

interface Props {
  listing: RestaurantListing;
  index?: number;
}

const FLAG: Record<string, string> = {
  FR: '🇫🇷', IT: '🇮🇹', GB: '🇬🇧', ES: '🇪🇸',
  NL: '🇳🇱', CZ: '🇨🇿', PT: '🇵🇹', AT: '🇦🇹',
};

// 썸네일용 그라디언트를 id 기반으로 생성
const THUMB_GRADIENTS = [
  'linear-gradient(135deg,#c084fc,#818cf8)',
  'linear-gradient(135deg,#fb923c,#f43f5e)',
  'linear-gradient(135deg,#2dd4bf,#0ea5e9)',
  'linear-gradient(135deg,#fbbf24,#f97316)',
  'linear-gradient(135deg,#60a5fa,#6366f1)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#34d399,#06b6d4)',
  'linear-gradient(135deg,#86efac,#4ade80)',
];

function StarRating({ value }: { value: number }): React.ReactElement {
  return (
    <span className="flex items-center gap-0.5">
      <svg className="h-3.5 w-3.5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
      <span className="text-sm font-bold text-[var(--text-strong)]">{value.toFixed(1)}</span>
    </span>
  );
}

export default function RestaurantCard({ listing, index = 0 }: Props): React.ReactElement {
  const gradient = THUMB_GRADIENTS[Number(listing.id) % THUMB_GRADIENTS.length] ?? THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];

  return (
    <Link href={`/restaurants/${listing.id}`}>
      <li className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-[#f0f5ff]">
        {/* 썸네일 */}
        <div
          className="h-[72px] w-[72px] flex-shrink-0 rounded-xl shadow-sm sm:h-20 sm:w-20"
          style={{ background: gradient }}
        />

        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--text-strong)]">{listing.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">{listing.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <StarRating value={listing.rating} />
            <span className="text-xs text-[var(--text-muted)]">({listing.review_count.toLocaleString()})</span>
            <span className="text-xs text-[var(--text-muted)]">
              {listing.cuisine} · {FLAG[listing.country] ?? ''} {listing.city}
            </span>
          </div>
        </div>
      </li>
    </Link>
  );
}
