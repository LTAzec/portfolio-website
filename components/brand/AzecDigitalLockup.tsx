interface AzecDigitalLockupProps {
  className?: string;
  /** Override the accent for the E-bar and DIGITAL fill. Defaults to AZEC blue. */
  accent?: string;
  label?: string;
}

/**
 * Official AZEC DIGITAL lockup — inline SVG, navbar-optimised.
 *
 * Matches the brand asset (azec-full-*.svg):
 *   - AZEC wordmark in geometric strokes (currentColor)
 *   - Middle E-bar in the AZEC blue (`#2D7BFF`)
 *   - Two hairline rules flanking DIGITAL
 *   - DIGITAL in spaced mono-feel smallcaps, blue, slightly softened
 *
 * The viewBox is 200x56 (vs the asset's 200x90) — the wordmark coords
 * are kept identical, only the vertical distance between wordmark and
 * DIGITAL is compressed so the lockup stays legible at small heights
 * (h-9 / h-10 — ~36–40px tall, ~128–143px wide). Visual proportions
 * of the individual letterforms are unchanged.
 *
 * Use `text-foreground` on the parent for the white-on-dark variant.
 */
export function AzecDigitalLockup({
  className,
  accent = "#2D7BFF",
  label = "AZEC Digital",
}: AzecDigitalLockupProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 56"
      fill="none"
      role="img"
      aria-label={label}
      textRendering="geometricPrecision"
      className={className}
    >
      {/* Wordmark — A · Z · E (with accent middle bar) · C */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
        <path d="M 4 42 L 18 6 L 32 42" />
        <path d="M 46 6 L 78 6 L 46 42 L 78 42" />
        <line x1="90" y1="6" x2="122" y2="6" />
        <line x1="90" y1="24" x2="112" y2="24" stroke={accent} />
        <line x1="90" y1="42" x2="122" y2="42" />
        <path d="M 168 14 A 18 18 0 1 0 168 36" />
      </g>

      {/* DIGITAL row — hairlines flanking spaced smallcaps */}
      <line
        x1="6"
        y1="50"
        x2="60"
        y2="50"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <text
        x="100"
        y="54"
        textAnchor="middle"
        fill={accent}
        opacity="0.85"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        letterSpacing="3.5"
        fontWeight="500"
      >
        DIGITAL
      </text>
      <line
        x1="140"
        y1="50"
        x2="194"
        y2="50"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  );
}
