/** A gear tooth inside a square — the mark in the top bar. */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="3" fill="none" stroke="#ff5a1f" strokeWidth="2" />
      <g className="logo__gear" style={{ transformOrigin: '16px 16px' }}>
        <path d="M16 6.5v4M16 21.5v4M6.5 16h4M21.5 16h4M9.3 9.3l2.8 2.8M19.9 19.9l2.8 2.8M9.3 22.7l2.8-2.8M19.9 12.1l2.8-2.8" stroke="#f2f2f0" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="4.2" fill="none" stroke="#f2f2f0" strokeWidth="2.2" />
      </g>
    </svg>
  );
}
