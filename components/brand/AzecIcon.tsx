interface AzecIconProps {
  className?: string;
  /**
   * Backplate variant. "light" = paper backplate with ink strokes (the
   * luminous tile look — recommended on dark backgrounds). "dark" = ink
   * backplate with paper strokes.
   */
  variant?: "light" | "dark";
  /** Override the accent for the middle E-bar. Defaults to AZEC blue. */
  accent?: string;
  label?: string;
}

/**
 * AZEC app-icon mark — a rounded-square containing the geometric AZEC
 * letterforms. Inline SVG so colours can be controlled via props.
 *
 * Letterforms are geometrically centred within the 200×200 viewBox:
 *   strokes span x=4→152 (width 148, internal centre at 78)
 *           and  y=6→42  (height 36, internal centre at 24)
 * To put the strokes' centre at the viewBox centre (100, 100) we
 * translate by (100−78, 100−24) = (22, 76). This makes the AZEC mark
 * sit visually perfectly centered inside the tile — which is what we
 * need when the icon is the anchor of the surrounding orbit system.
 *
 * The brand SVG files in /public/brand keep the designer's optical
 * offset; this component is the production render and is centred.
 */
export function AzecIcon({
  className,
  variant = "light",
  accent = "#2D7BFF",
  label = "AZEC",
}: AzecIconProps) {
  const isLight = variant === "light";
  const fill = isLight ? "#FAFAFA" : "#0B0E14";
  const stroke = isLight ? "#0B0E14" : "#FAFAFA";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label={label}
      className={className}
    >
      <rect x="6" y="6" width="188" height="188" rx="42" fill={fill} />
      <g
        transform="translate(22, 76)"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="square"
      >
        <path d="M 4 42 L 18 6 L 32 42" />
        <path d="M 46 6 L 78 6 L 46 42 L 78 42" />
        <line x1="90" y1="6" x2="118" y2="6" />
        <line x1="90" y1="24" x2="110" y2="24" stroke={accent} />
        <line x1="90" y1="42" x2="118" y2="42" />
        <path d="M 152 14 A 17 17 0 1 0 152 34" />
      </g>
    </svg>
  );
}
