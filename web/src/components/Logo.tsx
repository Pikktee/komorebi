import type { CSSProperties } from 'react';

interface MarkProps {
  size?: number;
  /** 'farbe' = grün/gold auf transparent · 'hell' = helle Variante für dunkle Flächen. */
  ton?: 'farbe' | 'hell';
  style?: CSSProperties;
}

/** Markenzeichen „Komorebi": Sonnenlicht, das durch ein Blatt fällt. */
export function KomorebiMark({ size = 34, ton = 'farbe', style }: MarkProps) {
  const uid = `km-${ton}`;
  const blattVon = ton === 'hell' ? '#eaf7ee' : '#3f9468';
  const blattBis = ton === 'hell' ? '#bfe6cd' : '#15532f';
  const vene = ton === 'hell' ? '#15532f' : '#eaf7ee';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Komorebi"
      style={style}
      className="nz-logo-svg"
    >
      <defs>
        <radialGradient id={`${uid}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#ffe49b" />
          <stop offset="1" stopColor="#f2b53e" />
        </radialGradient>
        <linearGradient id={`${uid}-leaf`} x1="14" y1="50" x2="44" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor={blattVon} />
          <stop offset="1" stopColor={blattBis} />
        </linearGradient>
      </defs>
      {/* Sonne mit Strahlen */}
      <circle cx="41" cy="22" r="10.5" fill={`url(#${uid}-sun)`} />
      <g stroke="#f2b53e" strokeWidth="2.4" strokeLinecap="round" className="nz-logo-sunbeam" style={{ transformOrigin: '41px 22px' }}>
        <path d="M41 4v5" />
        <path d="M56 11l-3.4 3.4" />
        <path d="M60 26h-5" />
        <path d="M26 9l3.4 3.4" />
      </g>
      {/* Blatt davor – Sonne lugt rechts oben hervor */}
      <g className="nz-logo-leaf" style={{ transformOrigin: '13px 51px' }}>
        <path
          d="M13 51C11 34 24 21 45 21C41 41 30 51 13 51Z"
          fill={`url(#${uid}-leaf)`}
        />
        <path
          d="M19 47C28 40 36 32 43 24"
          stroke={vene}
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path d="M29 39l-6 1M34 33l-5-0.5" stroke={vene} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  ton?: 'farbe' | 'hell';
}

/** Marke „Komorebi" – Sonne-durch-Blatt-Zeichen mit Wortmarke. */
export function Logo({ size = 34, withWordmark = true, ton = 'farbe' }: LogoProps) {
  return (
    <span className="nz-logo-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <KomorebiMark size={size} ton={ton} />
      {withWordmark && (
        <span
          className="nz-display nz-logo-wordmark"
          style={{
            fontWeight: 600,
            fontSize: size * 0.6,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: ton === 'hell' ? '#f3faf5' : 'var(--nz-ink)',
            transition: 'color 0.3s ease',
          }}
        >
          Komorebi
        </span>
      )}
    </span>
  );
}
