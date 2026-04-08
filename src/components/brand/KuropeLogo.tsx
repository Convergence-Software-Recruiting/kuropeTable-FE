interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export default function KuropeLogo({ size = 46, withWordmark = true, className = '' }: Props): React.ReactElement {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`.trim()}>
      <div className="kurope-logo-float relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="kurope logo"
        >
          <defs>
            <linearGradient id="kuropeRing" x1="10" y1="7" x2="60" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F9E8F" />
              <stop offset="1" stopColor="#3F6FB5" />
            </linearGradient>
            <linearGradient id="kuropeDot" x1="18" y1="12" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD18D" />
              <stop offset="1" stopColor="#FF9A5A" />
            </linearGradient>
          </defs>

          <rect x="4" y="4" width="64" height="64" rx="20" fill="#F7FBFF" />
          <path
            d="M36 14C23.9 14 14 23.9 14 36C14 48.1 23.9 58 36 58C48.1 58 58 48.1 58 36"
            stroke="url(#kuropeRing)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="24" cy="21" r="8" fill="url(#kuropeDot)" />
          <circle cx="30" cy="35" r="2.4" fill="#2F445B" />
          <circle cx="42" cy="35" r="2.4" fill="#2F445B" />
          <path d="M29 44C31.1 46.2 33.6 47.3 36 47.3C38.4 47.3 40.9 46.2 43 44" stroke="#2F445B" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M50.5 27.5L59 19" stroke="#3F6FB5" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      </div>

      {withWordmark && (
        <div className="leading-tight">
          <p className="text-[1.02rem] font-extrabold tracking-[-0.02em] text-[var(--text-strong)]">kurope table</p>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">field research pilot</p>
        </div>
      )}
    </div>
  );
}
