import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  label: string;
  value: string;
  href: string;
  /** Optional decoration to the left of the label/value. */
  icon?: ReactNode;
  external?: boolean;
  className?: string;
}

/**
 * Hairline-bordered contact card. Used on the /contact page.
 * Editorial layout: label (mono caps) + value (foreground), arrow right.
 */
export function ContactCard({
  label,
  value,
  href,
  icon,
  external = false,
  className,
}: ContactCardProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "ring-highlight group flex items-center justify-between gap-6 rounded-lg border border-border bg-charcoal/60 p-6 transition-colors duration-300 hover:border-border-strong hover:bg-charcoal-strong/70",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-5">
        {icon && (
          <span className="shrink-0 text-muted transition-colors group-hover:text-accent">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-eyebrow text-[10px]">{label}</div>
          <div className="mt-1.5 truncate text-[15px] font-medium text-foreground">
            {value}
          </div>
        </div>
      </div>
      <span
        aria-hidden
        className="shrink-0 font-mono text-[13px] text-muted transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
      >
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}
