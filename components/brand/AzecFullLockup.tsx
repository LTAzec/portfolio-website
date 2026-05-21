interface AzecFullLockupProps {
  className?: string;
  accent?: string;
  label?: string;
}

/**
 * Full AZEC Digital lockup — wordmark + "DIGITAL" sub-label flanked by
 * hairline rules. Use sparingly; the bare <AzecWordmark /> is the primary
 * navigation mark. This lockup is intended for footers, OG images,
 * and large brand moments.
 */
export function AzecFullLockup({
  className,
  accent = "#2D7BFF",
  label = "AZEC Digital",
}: AzecFullLockupProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 90"
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
        <path d="M 4 42 L 18 6 L 32 42" />
        <path d="M 46 6 L 78 6 L 46 42 L 78 42" />
        <line x1="90" y1="6" x2="122" y2="6" />
        <line x1="90" y1="24" x2="112" y2="24" stroke={accent} />
        <line x1="90" y1="42" x2="122" y2="42" />
        <path d="M 168 14 A 18 18 0 1 0 168 36" />
      </g>
      <line x1="6" y1="70" x2="60" y2="70" stroke="currentColor" strokeWidth="1" />
      <text
        x="100"
        y="74"
        textAnchor="middle"
        fill={accent}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        letterSpacing="3.5"
        fontWeight="500"
      >
        DIGITAL
      </text>
      <line x1="140" y1="70" x2="194" y2="70" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
