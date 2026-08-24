import QRCode from "qrcode";

import { cn } from "@/lib/cn";

/**
 * A QR code, generated on the server at build time and drawn as one SVG path.
 *
 * Generated rather than uploaded on purpose: a QR image pasted into the repo
 * goes stale the moment the link behind it changes, and nobody notices until
 * somebody tries to scan it at the pandal. This one is derived from the same
 * value the Register button points at, so the two cannot disagree. It also
 * costs no image request and stays sharp at any size.
 *
 * The module matrix is walked directly and emitted as path data rather than
 * injecting the library's SVG string, so nothing here needs
 * `dangerouslySetInnerHTML`.
 */
export async function QrCode({
  value,
  label,
  className,
}: {
  value: string;
  /** Accessible description of where the code leads. */
  label: string;
  className?: string;
}) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const data = modules.data;

  // Merge each run of dark modules in a row into one path segment.
  let d = "";
  for (let y = 0; y < size; y++) {
    let runStart = -1;
    for (let x = 0; x <= size; x++) {
      const dark = x < size && data[y * size + x] === 1;
      if (dark && runStart === -1) runStart = x;
      if (!dark && runStart !== -1) {
        d += `M${runStart} ${y}h${x - runStart}v1h-${x - runStart}z`;
        runStart = -1;
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      className={cn("h-full w-full", className)}
      shapeRendering="crispEdges"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
