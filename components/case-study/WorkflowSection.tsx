import type { ToolingModule } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { assetExists } from "@/lib/asset-utils";
import { EditorialImage } from "./EditorialImage";
import { Reveal } from "./Reveal";

interface WorkflowSectionProps {
  eyebrow: string;
  heading: string;
  description?: string;
  modules: ToolingModule[];
}

/**
 * Section 4 — Tooling / Systems.
 *
 * Renders a 2-column grid of tooling modules. Each card carries an eyebrow,
 * title, short description, and an optional editorial image thumbnail
 * with a subtle hover lift. Built to read as a system overview rather
 * than a portfolio gallery.
 *
 * The thumbnail is gated on the file being on disk — when assets aren't
 * ready yet, the card falls back to its text-only form (no slot
 * placeholder, no layout shift).
 */
export function WorkflowSection({
  eyebrow,
  heading,
  description,
  modules,
}: WorkflowSectionProps) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex max-w-3xl flex-col gap-5">
            <span className="text-eyebrow">{eyebrow}</span>
            <h2 className="text-balance text-[1.875rem] font-medium leading-[1.1] tracking-[-0.022em] text-foreground sm:text-[2.25rem]">
              {heading}
            </h2>
            {description && (
              <p className="text-pretty text-[16px] leading-[1.7] text-muted sm:text-[17px]">
                {description}
              </p>
            )}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 md:gap-6">
          {modules.map((mod, i) => {
            const showMedia = mod.media && assetExists(mod.media.src);
            return (
              <Reveal key={mod.title} delay={(i % 2) * 100}>
                <article className="ring-highlight group flex h-full flex-col gap-5 rounded-xl border border-border bg-charcoal/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-charcoal-strong/70 sm:p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-eyebrow text-[10px]">
                      {mod.eyebrow}
                    </span>
                  </div>

                  {showMedia && mod.media && (
                    <EditorialImage
                      image={mod.media}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="aspect-[16/9]"
                    />
                  )}

                  <div className="flex flex-col gap-2">
                    <h3 className="text-[18px] font-medium tracking-[-0.01em] text-foreground sm:text-[20px]">
                      {mod.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-muted sm:text-[14.5px]">
                      {mod.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
