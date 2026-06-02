import type { CaseStudyMetric } from "@/lib/types";
import { Reveal } from "./Reveal";

interface MetricsRailProps {
  metrics: CaseStudyMetric[];
}

/**
 * Compact 3-up (or 4-up) metrics row used inside the Results section.
 * Numbers are typographic, never marketing-loud. No icons, no gradients.
 */
export function MetricsRail({ metrics }: MetricsRailProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="ring-highlight grid grid-cols-1 divide-y divide-border rounded-xl border border-border bg-charcoal/55 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
      {metrics.map((m, i) => (
        <Reveal key={m.label} delay={(i % 3) * 90}>
          <div className="flex flex-col gap-2 p-6 sm:p-7">
            <span className="text-eyebrow text-[10px]">{m.label}</span>
            <span className="text-[2rem] font-medium leading-[1] tracking-[-0.02em] text-foreground sm:text-[2.25rem]">
              {m.value}
            </span>
            {m.detail && (
              <span className="text-[13px] leading-[1.55] text-muted">
                {m.detail}
              </span>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
