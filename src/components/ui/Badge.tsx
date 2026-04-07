interface Props {
  children: React.ReactNode;
  color?: 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange';
}

const colorClass: Record<NonNullable<Props['color']>, string> = {
  green: 'border border-[#b9ebcf] bg-[#ecfbf2] text-[#117a41]',
  yellow: 'border border-[#f4ddb1] bg-[#fdf5e5] text-[#976a13]',
  red: 'border border-[#f4c1c3] bg-[#ffeef0] text-[#b42329]',
  gray: 'border border-[#d8e0ee] bg-[#f3f6fc] text-[#56657f]',
  blue: 'border border-[#bed7ff] bg-[#edf4ff] text-[#1e5fca]',
  orange: 'border border-[#ffd9bb] bg-[#fff3e8] text-[#b65510]',
};

export default function Badge({ children, color = 'gray' }: Props): React.ReactElement {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass[color]}`}>
      {children}
    </span>
  );
}
