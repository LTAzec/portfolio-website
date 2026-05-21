interface AzecWordmarkProps {
  className?: string;
  /** Override the accent for the middle E-bar. Defaults to the AZEC blue. */
  accent?: string;
  /** Optional override for the aria-label. */
  label?: string;
}

/**
 * Inline AZEC wordmark. Letterforms are geometric strokes — the look is
 * controlled by stroke colour (via `currentColor`, so `text-foreground` /
 * `text-paper` work), and a single deliberate accent on the middle E-bar.
 *
 * Size by setting `className` (e.g. `h-6 w-auto`).
 */
export function AzecWordmark({
  className,
  accent = "#2D7BFF",
  label = "AZEC",
}: AzecWordmarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      role="img"
      aria-label={label}
      className={className}
    >
      {/* A */}
      <path d="M 4 42 L 18 6 L 32 42" />
      {/* Z */}
      <path d="M 46 6 L 78 6 L 46 42 L 78 42" />
      {/* E — top, middle (accent), bottom */}
      <line x1="90" y1="6" x2="122" y2="6" />
      <line x1="90" y1="24" x2="112" y2="24" stroke={accent} />
      <line x1="90" y1="42" x2="122" y2="42" />
      {/* C */}
      <path d="M 168 14 A 18 18 0 1 0 168 36" />
    </svg>
  );
}
