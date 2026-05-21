import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Render as <section>, <header>, etc. Defaults to <div>. */
  as?: "div" | "section" | "header" | "footer" | "main";
}

/**
 * Width-capped wrapper with consistent horizontal padding.
 * Every section content block should be wrapped in this.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
