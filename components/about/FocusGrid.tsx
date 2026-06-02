import type { FocusArea } from "@/data/about";

interface FocusGridProps {
  areas: FocusArea[];
}

/**
 * Compact 5-up focus grid for the About page. Small editorial cards —
 * mono numeral, title, one-line description. No icons, no chrome.
 */
export function FocusGrid({ areas }: FocusGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {areas.map((area) => (
        <article
          key={area.title}
          className="ring-highlight flex h-full flex-col gap-2 rounded-xl border border-border bg-charcoal/50 p-5 sm:p-6"
        >
          <span className="text-eyebrow text-[10px] text-accent">
            {area.index}
          </span>
          <h3 className="text-[15px] font-medium tracking-[-0.005em] text-foreground">
            {area.title}
          </h3>
          <p className="text-[13.5px] leading-[1.6] text-muted">
            {area.description}
          </p>
        </article>
      ))}
    </div>
  );
}
