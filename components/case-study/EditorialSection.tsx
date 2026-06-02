import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface EditorialSectionProps {
  eyebrow: string;
  /** Optional large heading rendered above the body. */
  heading?: string;
  /** Body slot — pass paragraphs as ReactNode for rich layouts. */
  children: ReactNode;
  /** Extra slot rendered after the body, full-width (not 4/8 constrained). */
  extra?: ReactNode;
  /** Disable the bottom border (used for the last section before the closing block). */
  noDivider?: boolean;
  /** Override section padding. */
  className?: string;
  /** Optional id for in-page anchors. */
  id?: string;
}

/**
 * Editorial 4/8 layout: mono eyebrow on the left rail, content body on the
 * right rail. Mirrors the rhythm of the existing CaseStudy CaseBlock so the
 * long-form study reads consistently with the rest of the site.
 */
export function EditorialSection({
  eyebrow,
  heading,
  children,
  extra,
  noDivider = false,
  className,
  id,
}: EditorialSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20",
        !noDivider && "border-b border-border",
        className,
      )}
    >
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <span className="text-eyebrow">{eyebrow}</span>
              {heading && (
                <h2 className="mt-4 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2rem]">
                  {heading}
                </h2>
              )}
            </div>
            <div className="lg:col-span-8">{children}</div>
          </div>
        </Reveal>

        {extra && <div className="mt-12 sm:mt-16">{extra}</div>}
      </Container>
    </section>
  );
}

/** Helper for editorial body copy — keeps line-length and rhythm consistent. */
export function EditorialProse({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-5", className)}>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-pretty text-[16px] leading-[1.7] text-foreground/85 sm:text-[17px] sm:leading-[1.72]"
        >
          {p}
        </p>
      ))}
    </div>
  );
}
