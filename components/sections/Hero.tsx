import { Container } from "@/components/layout/Container";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";

/**
 * Editorial hero. Asymmetric 7/5 grid on desktop:
 *
 *   LEFT  — eyebrow index, oversized headline ("clean" underlined in
 *           the AZEC blue, matching the wordmark E-bar), positioning
 *           paragraph, two CTAs, live availability indicator.
 *   RIGHT — <HeroVisual />: a quiet animated AZEC Digital "studio system"
 *           around the central icon — orbiting capability chips,
 *           hairline rings, and two developer-style status panels.
 *
 * Mobile collapses to a single stacked column. The global <Backdrop />
 * carries the page-wide grid + wordmark watermark + soft blue zone.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Container className="relative pt-24 pb-24 sm:pt-32 sm:pb-28 lg:pt-32 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* ── Left column ─────────────────────────────────────── */}
          <div className="flex flex-col lg:col-span-7">
            <span className="text-eyebrow flex items-center gap-3">
              <span className="text-accent">01</span>
              <span className="h-px w-6 bg-faint" />
              <span>Studio</span>
            </span>

            <h1 className="mt-8 text-balance text-[2.625rem] font-medium leading-[1.04] tracking-[-0.03em] text-foreground sm:text-[3.5rem] lg:text-[4.25rem] lg:leading-[1.02]">
              Building{" "}
              <span className="accent-underline">clean</span>{" "}
              software,
              <br className="hidden sm:block" /> modern interfaces and practical
              internal tooling.
            </h1>

            <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg sm:leading-[1.7]">
              {site.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#projects" variant="primary" size="lg">
                View work
                <Arrow />
              </Button>
              <a
                href="#contact"
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
              >
                Get in touch
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </div>

            <div className="mt-10 inline-flex items-center gap-2.5 text-[12px] text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>{site.availability}</span>
            </div>
          </div>

          {/* ── Right column — animated AZEC system ─────────────── */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>

        {/* Bottom editorial rule */}
        <div className="mt-20 border-t border-border pt-5 sm:mt-28 lg:mt-32">
          <div className="text-eyebrow flex flex-wrap items-center justify-between gap-y-2 text-[10px]">
            <span>{site.location} · Remote</span>
            <span className="hidden sm:inline">Est. {site.founded}</span>
            <a
              href="#projects"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <span>Scroll</span>
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
