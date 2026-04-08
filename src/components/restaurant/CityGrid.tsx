import type { CityItem } from '@/lib/types/listing';

interface Props {
  cities: CityItem[];
  selected: string | null;
  onSelect: (cityId: string | null) => void;
}

const badgeLabel: Record<NonNullable<CityItem['badge']>, string> = {
  popular: '인기',
  trending: '핫',
};

export default function CityGrid({ cities, selected, onSelect }: Props): React.ReactElement {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cities.map((city) => {
        const isActive = selected === city.id;
        return (
          <button
            key={city.id}
            onClick={() => onSelect(isActive ? null : city.id)}
            className="flex flex-shrink-0 flex-col items-center gap-2"
          >
            <div
              className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl transition-all duration-200 sm:h-20 sm:w-20"
              style={{
                background: city.gradient,
                boxShadow: isActive
                  ? '0 0 0 3px var(--primary), 0 8px 24px -8px rgba(47,128,255,0.4)'
                  : '0 6px 18px -6px rgba(16,24,40,0.22)',
              }}
            >
              {city.badge && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#344054]">
                  {badgeLabel[city.badge]}
                </span>
              )}
              <span className="absolute bottom-1.5 right-1.5 text-xs font-bold text-white/70">
                {city.country}
              </span>
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: isActive ? 'var(--primary-strong)' : 'var(--text-default)' }}
            >
              {city.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
