import fs from "fs";
import path from "path";
import { Fragment } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

interface PortraitRef {
  src: string;
  alt: string;
  /** Two-letter fallback shown until the file is on disk. */
  initials?: string;
}

interface AboutHeroProps {
  /** Eyebrow index (e.g. "02"). */
  index: string;
  /** Eyebrow label (e.g. "About"). */
  eyebrow: string;
  /** Main heading — the name. */
  title: string;
  /** Role chip row rendered under the title. */
  chips: string[];
  /** Optional intro paragraph. */
  intro?: string;
  /** Optional location / availability line. */
  availability?: string;
  /** Optional portrait — rendered as a circular frame with ambient glow. */
  portrait?: PortraitRef;
}

const publicDir = path.join(process.cwd(), "public");

/**
 * Editorial About-page hero.
 *
 *   - Eyebrow with accent index
 *   - Large name slab (matches case-study title scale)
 *   - Role-chip row in mono caps
 *   - Optional intro paragraph
 *   - Optional availability dot + location
 *   - Optional portrait — switches to a 2-column layout on lg+, with a
 *     circular frame, animated blue glow, soft float and a subtle
 *     inset vignette to soften busy backgrounds in the source image.
 *
 * Server component. The portrait gracefully falls back to a styled
 * initials placeholder when the file isn't on disk yet — same pattern
 * as EditorialImage on the case-study side.
 */
export function AboutHero({
  index,
  eyebrow,
  title,
  chips,
  intro,
  availability,
  portrait,
}: AboutHeroProps) {
  return (
    <section className="pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40">
      <Container>
        <div
          className={cn(
            "grid grid-cols-1 gap-10",
            portrait && "lg:grid-cols-12 lg:items-center lg:gap-14",
          )}
        >
          <div className={cn(portrait && "lg:col-span-8")}>
            <span className="text-eyebrow flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span className="h-px w-6 bg-faint" />
              <span>{eyebrow}</span>
            </span>

            <h1 className="mt-6 text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.02]">
              {title}
            </h1>

            {chips.length > 0 && (
              <div className="text-eyebrow mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                {chips.map((chip, i) => (
                  <Fragment key={chip}>
                    <span>{chip}</span>
                    {i < chips.length - 1 && (
                      <span aria-hidden className="text-faint">
                        ·
                      </span>
                    )}
                  </Fragment>
                ))}
              </div>
            )}

            {intro && (
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                {intro}
              </p>
            )}

            {availability && (
              <div className="mt-8 inline-flex items-center gap-2.5 text-[12px] text-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span>{availability}</span>
              </div>
            )}
          </div>

          {portrait && (
            <div className="lg:col-span-4">
              <PortraitFrame portrait={portrait} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function PortraitFrame({ portrait }: { portrait: PortraitRef }) {
  const present = imageExists(portrait.src);
  const initials = (portrait.initials ?? deriveInitials(portrait.alt)).slice(0, 2);

  return (
    <div className="mx-auto w-fit lg:mx-0 lg:ml-auto">
      <div className="relative h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] lg:h-[300px] lg:w-[300px]">
        {/* Ambient blue glow — extends past the circle, gently pulses */}
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute inset-[-18%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(45,123,255,0.32) 0%, transparent 65%)",
          }}
        />

        {/* Circular portrait */}
        <div
          className={cn(
            "animate-float-y ring-highlight relative h-full w-full overflow-hidden rounded-full border border-border-strong",
            "shadow-[0_22px_56px_-26px_rgba(0,0,0,0.7)]",
            "transition-transform duration-500 will-change-transform",
            "lg:hover:scale-[1.015]",
          )}
        >
          {present ? (
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 260px, 220px"
              className="object-cover object-[center_28%]"
              priority
            />
          ) : (
            <PortraitPlaceholder initials={initials} />
          )}

          {/* Inset vignette — softens any messy background in the source */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, transparent 55%, rgba(11,14,20,0.45) 100%)",
            }}
          />

          {/* Glass-style inset highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5 ring-inset"
          />
        </div>
      </div>
    </div>
  );
}

function PortraitPlaceholder({ initials }: { initials: string }) {
  return (
    <div className="bg-charcoal-strong relative flex h-full w-full items-center justify-center">
      <div className="bg-dots absolute inset-0 opacity-30" />
      <span className="relative font-mono text-[44px] tracking-[0.04em] text-foreground/65">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

function imageExists(src: string): boolean {
  if (!src) return false;
  try {
    return fs.existsSync(path.join(publicDir, src.replace(/^\//, "")));
  } catch {
    return false;
  }
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[parts.length - 1][0];
}
