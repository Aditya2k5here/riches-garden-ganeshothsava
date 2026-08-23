import { ScrollLock } from "./ScrollLock";

/**
 * LOADING EXPERIENCE
 *
 * A small Ganesha keeping a football up while the page settles.
 *
 * Entirely server-rendered, and animated — including its own dismissal — in
 * CSS. Nothing here waits for React: the scene plays and clears on the same
 * schedule whether the bundle has finished loading or not, which is what
 * keeps the hero behind it paintable on a slow phone.
 *
 * The only JavaScript involved is `ScrollLock`, which stops the page moving
 * underneath the overlay. That is an enhancement, not a requirement — with
 * scripting off, the noscript rule in the root layout removes the loader
 * outright and nothing is ever locked.
 *
 * Timing lives in one place: `--loader-hold` in globals.css.
 */
export function Loader() {
  return (
    <div
      className="loader grain"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <ScrollLock />

      <div className="relative flex flex-col items-center gap-9 px-6">
        <svg
          viewBox="0 0 200 200"
          className="loader-figure h-36 w-36 text-gold sm:h-44 sm:w-44"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* crown */}
            <path d="M84 46c4-12 9-19 16-22 7 3 12 10 16 22" />
            <path d="M100 18v-7" />
            <circle cx="100" cy="8" r="3" />
            {/* head */}
            <path d="M68 62c6-10 18-16 32-16s26 6 32 16c5 8 7 17 6 26" />
            {/* ears */}
            <path d="M69 63c-14-3-26 3-30 16-4 14 4 27 18 31 6 2 12 1 16-2" />
            <path d="M131 63c14-3 26 3 30 16 4 14-4 27-18 31-6 2-12 1-16-2" />
            {/* eyes */}
            <path d="M86 78h6" />
            <path d="M108 78h6" />
            {/* tusks */}
            <path d="M84 108c-5 4-8 9-8 15" opacity="0.5" />
            <path d="M116 108c5 4 8 9 8 15" opacity="0.5" />
            {/* trunk — sways in time with the ball */}
            <g className="loader-trunk">
              <path d="M100 84c1 16-1 29-8 39-6 9-14 15-14 25 0 8 7 12 14 10 6-2 9-8 7-14" />
            </g>
          </g>

          {/* the football */}
          <g className="loader-ball">
            <circle
              cx="148"
              cy="150"
              r="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
            />
            <path
              d="M148 141l6 4-2 7h-8l-2-7z"
              fill="currentColor"
              opacity="0.85"
            />
            <g stroke="currentColor" strokeWidth="1.6" opacity="0.7">
              <path d="M154 145l6-2" />
              <path d="M142 145l-6-2" />
              <path d="M146 159l-3 5" />
              <path d="M150 159l3 5" />
            </g>
          </g>
        </svg>

        <div className="flex flex-col items-center gap-4">
          <p className="font-sans text-[0.6875rem] font-medium tracking-[0.4em] text-cream/80 uppercase">
            Riches Garden
          </p>
          <div
            className="h-px w-32 overflow-hidden bg-cream/20"
            aria-hidden="true"
          >
            <div className="loader-bar h-full w-full origin-left bg-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}
