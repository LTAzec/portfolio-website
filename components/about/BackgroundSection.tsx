import type { TimelineItem } from "@/lib/types";

interface BackgroundSectionProps {
  items: TimelineItem[];
}

/**
 * "Relevant background" section on the About page.
 *
 *   - The single `featured: true` entry renders as a larger glass card
 *     with a category badge, a year rail, and a multi-paragraph body.
 *   - The remaining entries render as compact hairline rows underneath,
 *     each with its own small category badge, a one-line description
 *     and the year on the left.
 *
 * Intent: keep the section honest. One real software role gets the
 * weight it deserves; supporting context (support, coaching) stays
 * supporting context.
 */
export function BackgroundSection({ items }: BackgroundSectionProps) {
  const featured = items.find((item) => item.featured);
  const compact = items.filter((item) => !item.featured);

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {featured && <FeaturedEntry item={featured} />}

      {compact.length > 0 && (
        <ul className="divide-y divide-border border-y border-border">
          {compact.map((item) => (
            <CompactEntry key={item.title} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FeaturedEntry({ item }: { item: TimelineItem }) {
  const paragraphs = item.body ?? (item.description ? [item.description] : []);

  return (
    <article className="ring-highlight rounded-xl border border-border bg-charcoal-strong/60 p-6 shadow-[0_18px_48px_-24px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <span className="font-mono text-[11px] tracking-[0.06em] text-faint tabular-nums">
            {item.year}
          </span>
          {item.category && (
            <div className="mt-3 inline-flex">
              <span className="text-eyebrow inline-flex items-center rounded-full border border-border bg-charcoal/70 px-2.5 py-1 text-[10px] text-accent">
                {item.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:col-span-9">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="text-balance text-[1.375rem] font-medium leading-[1.15] tracking-[-0.015em] text-foreground sm:text-[1.5rem]">
              {item.title}
            </h3>
            {item.meta && (
              <span className="text-eyebrow text-[10px]">{item.meta}</span>
            )}
          </div>

          <div className="mt-1 flex flex-col gap-4">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="max-w-2xl text-pretty text-[15px] leading-[1.7] text-foreground/85 sm:text-[15.5px]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactEntry({ item }: { item: TimelineItem }) {
  return (
    <li className="grid grid-cols-[7rem_1fr] gap-x-6 py-6 sm:grid-cols-[9rem_1fr] sm:gap-x-10">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.04em] text-faint tabular-nums">
          {item.year}
        </span>
        {item.category && (
          <span className="text-eyebrow inline-flex w-fit items-center rounded-full border border-border bg-charcoal/55 px-2 py-0.5 text-[9px] text-muted">
            {item.category}
          </span>
        )}
      </div>
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
          <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.6] text-muted sm:text-[14px]">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}
