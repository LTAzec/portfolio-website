import { CapabilityCard } from "@/components/ui/CapabilityCard";
import type { Capability } from "@/lib/types";

interface CapabilityGridProps {
  capabilities: Capability[];
}

/**
 * Reusable capability grid. Used by the Capabilities section on the
 * home page and inside the About page. Stays responsive across all
 * viewports (1 → 2 → 3 columns).
 */
export function CapabilityGrid({ capabilities }: CapabilityGridProps) {
  const total = capabilities.length;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {capabilities.map((cap, i) => (
        <CapabilityCard
          key={cap.title}
          index={i}
          total={total}
          title={cap.title}
          description={cap.description}
          items={cap.items}
        />
      ))}
    </div>
  );
}
