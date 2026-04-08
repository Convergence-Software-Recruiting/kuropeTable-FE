import type { PriceRange } from '@/lib/types/listing';
import { PRICE_LABELS } from '@/lib/types/listing';

const TABS: { value: PriceRange | 'all'; label: string }[] = [
  { value: 'all',     label: '전체' },
  { value: 'budget',  label: PRICE_LABELS.budget },
  { value: 'mid',     label: PRICE_LABELS.mid },
  { value: 'upscale', label: PRICE_LABELS.upscale },
  { value: 'fine',    label: PRICE_LABELS.fine },
];

interface Props {
  selected: PriceRange | 'all';
  onChange: (value: PriceRange | 'all') => void;
}

export default function PriceFilter({ selected, onChange }: Props): React.ReactElement {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[var(--line)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => {
        const isActive = selected === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={[
              'flex-shrink-0 px-3 pb-3 pt-1 text-sm font-semibold transition-colors',
              isActive
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-default)]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
