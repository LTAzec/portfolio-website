import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import {
  HeroVisual,
  HeroVisualMobile,
} from "@/components/sections/HeroVisual";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";

/**
 * Editorial hero — minimal, brand-led.
 * Two layouts: mobile flex column + desktop 7/5 grid. Shared content
 * blocks defined once as local JSX vars.
 *
 * CTAs route to the dedicated pages (/projects, /contact) via locale-aware
 * links so the active language is preserved on navigation.
 */
export function Hero() {
  const t = useTranslations("hero");

  const eyebrow = (
    <span className="text-eyebrow flex items-center gap-3">
      <span className="text-accent">01</span>
      <span className="h-px w-6 bg-faint" />
      <span>{t("eyebrow")}</span>
    </span>
  );

  const headline = (
    <h1 className="text-balance text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[4rem] lg:text-[5rem] lg:leading-[1]">
      AZEC Digital
    </h1>
  );

  const subtitle = (
    <p className="max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-[17px] sm:leading-[1.65]">
      {t.rich("subtitle", {
        accent: (chunks) => <span className="accent-underline">{chunks}</span>,
      })}
    </p>
  );

  const ctas = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <Button href="/projects" variant="primary" size="lg">
        {t("viewWork")}
        <Arrow />
      </Button>
      <Link
        href="/contact"
        className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
      >
        {t("getInTouch")}
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </div>
  );

  const availability = (
    <div className="inline-flex items-center gap-2.5 text-[12px] text-muted">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span>{site.availability}</span>
    </div>
  );

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Container className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32">
        <div className="flex flex-col gap-7 lg:hidden">
          {eyebrow}
          {headline}
          {subtitle}
          {ctas}
          <HeroVisualMobile />
          {availability}
        </div>

        <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-20">
          <div className="flex flex-col gap-8 lg:col-span-7">
            {eyebrow}
            {headline}
            {subtitle}
            {ctas}
            {availability}
          </div>
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-5 sm:mt-20 lg:mt-32">
          <div className="text-eyebrow flex flex-wrap items-center justify-between gap-y-2 text-[10px]">
            <span>
              {site.location} · {t("remote")}
            </span>
            <span className="hidden sm:inline">
              {t("est", { year: String(site.founded) })}
            </span>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <span>{t("seeProjects")}</span>
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
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
