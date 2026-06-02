import type { EngineeringCard } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Reveal } from "./Reveal";

interface EngineeringApproachGridProps {
  eyebrow: string;
  heading: string;
  description?: string;
  cards: EngineeringCard[];
}

/**
 * Section 5 — Engineering approach. Three-column grid of small editorial
 * cards. Each card is just a numeral, a title, and a paragraph — no icons,
 * no charts, no fluff. Reads like a system spec sheet.
 */
export function EngineeringApproachGrid({
  eyebrow,
  heading,
  description,
  cards,
}: EngineeringApproachGridProps) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <span className="text-eyebrow">{eyebrow}</span>
              <h2 className="mt-4 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2rem]">
                {heading}
              </h2>
            </div>
            {description && (
              <p className="max-w-xl text-pretty text-[16px] leading-[1.7] text-muted lg:col-span-8 sm:text-[17px]">
                {description}
              </p>
            )}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={(i % 3) * 90}>
              <article className="ring-highlight flex h-full flex-col gap-3 rounded-xl border border-border bg-charcoal/55 p-5 sm:p-6">
                <span className="text-eyebrow text-[10px] text-accent">
                  {card.index}
                </span>
                <h3 className="text-[16px] font-medium tracking-[-0.005em] text-foreground sm:text-[17px]">
                  {card.title}
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-muted sm:text-[14px]">
                  {card.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
