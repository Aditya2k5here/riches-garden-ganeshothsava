/**
 * ORNAMENT
 *
 * Original line ornaments drawn for Riches Garden — a lotus rule, a radial
 * mandala and a Ganesha glyph. They carry the cultural register of the
 * poster without borrowing from it, and being SVG they cost nothing to load
 * and stay crisp at any size.
 *
 * All strokes inherit `currentColor`, so an ornament simply takes the colour
 * of whatever it sits inside.
 */

type Props = {
  className?: string;
};

/** Horizontal divider: tapering hairlines either side of a lotus bud. */
export function LotusRule({ className }: Props) {
  return (
    <svg
      viewBox="0 0 400 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id="rg-rule-l" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="rg-rule-r" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d="M4 16h150" stroke="url(#rg-rule-l)" strokeWidth="1" />
      <path d="M246 16h150" stroke="url(#rg-rule-r)" strokeWidth="1" />

      {/* Small diamonds punctuating the rule */}
      <path d="M158 16l4-4 4 4-4 4z" fill="currentColor" opacity="0.7" />
      <path d="M234 16l4-4 4 4-4 4z" fill="currentColor" opacity="0.7" />

      {/* Lotus bud */}
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M200 6c-5 5-7 10-7 14 0 5 3 8 7 8s7-3 7-8c0-4-2-9-7-14z" />
        <path d="M193 20c-5-3-9-3-12-1 1 4 5 7 10 7" />
        <path d="M207 20c5-3 9-3 12-1-1 4-5 7-10 7" />
        <path d="M186 16c-4 0-7 2-9 5 3 3 7 4 11 2" />
        <path d="M214 16c4 0 7 2 9 5-3 3-7 4-11 2" />
      </g>
    </svg>
  );
}

/**
 * Radial mandala for large background fields. Generated from a repeated petal
 * so the file stays small — 24 petals from one path definition.
 */
export function Mandala({ className }: Props) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  const spokes = Array.from({ length: 48 }, (_, i) => i * 7.5);

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="0.8">
        <circle cx="300" cy="300" r="96" opacity="0.5" />
        <circle cx="300" cy="300" r="150" opacity="0.35" />
        <circle cx="300" cy="300" r="232" opacity="0.5" />
        <circle cx="300" cy="300" r="248" opacity="0.3" />

        {petals.map((deg) => (
          <path
            key={deg}
            d="M300 152c-16 22-24 42-24 60 0 22 11 36 24 36s24-14 24-36c0-18-8-38-24-60z"
            transform={`rotate(${deg} 300 300)`}
            opacity="0.32"
          />
        ))}

        {spokes.map((deg) => (
          <path
            key={deg}
            d="M300 236v-38"
            transform={`rotate(${deg} 300 300)`}
            opacity="0.4"
          />
        ))}

        {petals.map((deg) => (
          <path
            key={`o-${deg}`}
            d="M300 68c-9 14-13 25-13 34 0 12 6 20 13 20s13-8 13-20c0-9-4-20-13-34z"
            transform={`rotate(${deg + 7.5} 300 300)`}
            opacity="0.22"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Minimal Ganesha glyph — crown, ears, trunk. Used in the loader, the section
 * markers and the favicon. Drawn as open strokes so it reads at 20px and at
 * 400px alike.
 */
export function GaneshaGlyph({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* crown */}
        <path d="M84 46c4-12 9-19 16-22 7 3 12 10 16 22" />
        <path d="M100 18v-8" />
        <circle cx="100" cy="8" r="3.5" />
        {/* head */}
        <path d="M68 62c6-10 18-16 32-16s26 6 32 16c5 8 7 17 6 26" />
        {/* ears */}
        <path d="M69 63c-14-3-26 3-30 16-4 14 4 27 18 31 6 2 12 1 16-2" />
        <path d="M131 63c14-3 26 3 30 16 4 14-4 27-18 31-6 2-12 1-16-2" />
        {/* eyes */}
        <path d="M86 78h6" />
        <path d="M108 78h6" />
        {/* trunk */}
        <path d="M100 84c1 16-1 29-8 39-6 9-16 14-16 24 0 8 7 13 14 11 6-2 9-8 7-14" />
        {/* tusks */}
        <path d="M84 108c-5 4-8 9-8 15" opacity="0.55" />
        <path d="M116 108c5 4 8 9 8 15" opacity="0.55" />
      </g>
    </svg>
  );
}
