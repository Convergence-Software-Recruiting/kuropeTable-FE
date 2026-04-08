import type { CityItem } from '@/lib/types/listing';
import { BADGE_LABELS, TRACK_SHORT_LABELS } from '@/lib/types/listing';
import { getCityCoverImagePath } from '@/lib/utils/imagePaths';

interface Props {
  cities: CityItem[];
  selected: string | null;
  onSelect: (cityId: string | null) => void;
}

const trackTagClass: Record<CityItem['serviceTrack'], string> = {
  catchtable: 'bg-[#fff1e8] text-[#b65a1e] border-[#ffd4b3]',
  rentcar: 'bg-[#eafbf6] text-[#0f7662] border-[#b7e9da]',
  grocery: 'bg-[#edf3ff] text-[#2852a0] border-[#c7d9ff]',
};

export default function CityGrid({ cities, selected, onSelect }: Props): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map((city, index) => {
        const isActive = selected === city.id;

        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelect(isActive ? null : city.id)}
            className={[
              'group relative overflow-hidden rounded-2xl border p-0 text-left transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(47,128,255,0.22)]',
              isActive
                ? 'border-[var(--primary)] shadow-[0_22px_40px_-28px_rgba(47,128,255,0.72)]'
                : 'border-[var(--line)] shadow-[0_14px_30px_-26px_rgba(16,24,40,0.52)] hover:border-[#bfd1ec]',
            ].join(' ')}
          >
            <div
              className="relative h-[82px] w-full"
              style={{
                backgroundImage: `url(${getCityCoverImagePath(city.id)}), ${city.gradient}`,
                backgroundSize: 'cover, auto',
                backgroundPosition: 'center, center',
                transitionDelay: `${index * 18}ms`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(18,30,48,0.28)_100%)]" />

              {city.badge && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#2f445b]">
                  {BADGE_LABELS[city.badge]}
                </span>
              )}

              <span className="absolute bottom-2 right-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-bold text-[#3c4e63]">
                {city.country}
              </span>
            </div>

            <div className="space-y-1.5 p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.95rem] font-extrabold tracking-[-0.01em] text-[var(--text-strong)]">{city.name}</p>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">{city.countryName}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${trackTagClass[city.serviceTrack]}`}>
                  {TRACK_SHORT_LABELS[city.serviceTrack]}
                </span>
              </div>

              <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-default)]">{city.districtFocus}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
