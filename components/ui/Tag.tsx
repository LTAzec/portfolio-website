import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  className?: string;
}

/**
 * Outline pill used for tech-stack labels and other inline metadata.
 * Mono font + wide tracking match the AZEC "DIGITAL" type treatment.
 * Transparent background keeps it editorial, not bubbly.
 */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
