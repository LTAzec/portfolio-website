import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Apply a subtle hover lift + brighter border. Defaults to true. */
  interactive?: boolean;
  /** Render as <article>, <li>, etc. Defaults to <div>. */
  as?: ElementType;
}

/**
 * Studio surface — hairline-bordered charcoal plate. The "glass" name is
 * kept for backward compatibility with existing imports; the look is
 * now closer to engineered card stock than blurred glass.
 *
 * Used by ProjectIndex, case-study rows, and any future elevated content.
 */
export function GlassCard({
  children,
  className,
  interactive = true,
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-charcoal/60 ring-highlight",
        interactive &&
          "transition-colors duration-300 hover:border-border-strong hover:bg-charcoal-strong/70",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
