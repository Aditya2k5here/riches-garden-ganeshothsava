/**
 * Renders a rupee amount with the ₹ mark set in the sans face.
 *
 * Not a stylistic whim: U+20B9 sits in the `latin-ext` slice of a Google
 * font, so setting it in the display serif made the browser fetch a whole
 * extra 34 kB Cormorant file for one glyph. The sans slice is already being
 * downloaded for the rupee elsewhere, so borrowing its ₹ costs nothing — and
 * the mark is geometric enough that it sits happily beside serif numerals.
 */
export function Amount({
  value,
  className,
}: {
  /** e.g. "₹2,000" */
  value: string;
  className?: string;
}) {
  const [symbol, ...rest] = [value.slice(0, 1), value.slice(1)];
  const digits = rest.join("");

  if (symbol !== "₹") return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      <span className="font-sans font-normal">₹</span>
      {digits}
    </span>
  );
}
