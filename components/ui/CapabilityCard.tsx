import { Tag } from "@/components/ui/Tag";

interface CapabilityCardProps {
  /** Zero-based index — used to render the editorial `01 / 05` marker. */
  index: number;
  total: number;
  title: string;
  description: string;
  items: string[];
}

/**
 * Editorial capability card. Hairline-bordered surface with a numbered
 * index label, a short description, and a tag list of concrete items.
 * Sweep-in accent rule on hover mirrors the FeaturedProjects rhythm.
 *
 * No progress bars, no star ratings — just clean editorial blocks.
 */
export function CapabilityCard({
  index,
  total,
  title,
  description,
  items,
}: CapabilityCardProps) {
  const idx = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <article className="ring-highlight group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-charcoal/60 p-6 transition-colors duration-300 hover:border-border-strong hover:bg-charcoal-strong/70">
      {/* Sweep-in accent rule on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-700 ease-out group-hover:w-full"
      />

      {/* Top — index + section name */}
      <div className="flex items-center justify-between">
        <span className="text-eyebrow text-[10px]">
          <span className="text-accent">{idx}</span>
          <span className="mx-1.5 text-faint">/</span>
          <span>{totalLabel}</span>
        </span>
        <span className="text-eyebrow text-[10px]">{title}</span>
      </div>

      {/* Description */}
      <p className="mt-6 text-[15px] leading-relaxed text-foreground">
        {description}
      </p>

      {/* Items */}
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-7">
        {items.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}
