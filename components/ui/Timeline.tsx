import type { TimelineItem } from "@/lib/types";

interface TimelineProps {
  items: TimelineItem[];
}

/**
 * Editorial vertical timeline — year (mono) on the left, content on
 * the right. Hairline dividers between entries. Used on the About page.
 *
 * Layout uses a grid so years remain perfectly aligned regardless of
 * description length.
 */
export function Timeline({ items }: TimelineProps) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <li
          key={i}
          className="grid grid-cols-[7rem_1fr] gap-x-6 py-6 sm:grid-cols-[9rem_1fr] sm:gap-x-10"
        >
          <span className="font-mono text-[11px] tracking-[0.04em] text-faint tabular-nums">
            {item.year}
          </span>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-[15px] font-medium text-foreground">
                {item.title}
              </h3>
              {item.meta && (
                <span className="text-eyebrow text-[10px]">{item.meta}</span>
              )}
            </div>
            {item.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
