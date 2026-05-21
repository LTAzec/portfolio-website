import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Two-digit section index, displayed in accent blue (e.g. "02"). */
  index?: string;
  /** Small uppercase label — e.g. "Selected work". */
  eyebrow?: string;
  /** Main heading text. Wrap accent words in `{...}` for the underline. */
  title: string;
  /** Optional supporting paragraph below the title. */
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Editorial section header.
 *
 *   01 ─── EYEBROW
 *   Section title with one {accent} word underlined in blue.
 *   Optional subtitle paragraph.
 *
 * Used by every section so visual rhythm stays identical across the page.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-5", alignment, className)}>
      {(index || eyebrow) && (
        <span className="text-eyebrow flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          {index && eyebrow && <span className="h-px w-6 bg-faint" />}
          {eyebrow && <span>{eyebrow}</span>}
        </span>
      )}

      <h2 className="max-w-3xl text-balance text-3xl font-medium tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {renderTitle(title)}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Splits the title around `{...}` markers and renders matched segments
 * with the editorial blue underline (matches the hero "clean" treatment).
 */
function renderTitle(title: string) {
  const parts = title.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      return (
        <span key={i} className="accent-underline">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
