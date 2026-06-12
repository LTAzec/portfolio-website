import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { AboutHero } from "@/components/about/AboutHero";
import { BackgroundSection } from "@/components/about/BackgroundSection";
import { FocusGrid } from "@/components/about/FocusGrid";
import { ProjectShelf } from "@/components/about/ProjectShelf";
import { Container } from "@/components/layout/Container";
import { CapabilityGrid } from "@/components/ui/CapabilityGrid";
import { CTASection } from "@/components/ui/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import { focusAreas, profileParagraphs, roleChips } from "@/data/about";
import { getProjects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";
import { capabilities } from "@/data/capabilities";
import { experience } from "@/data/experience";
import { resolveLocalizedDeep } from "@/lib/i18n";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return {
    title: `${t("metaTitle")} — ${site.name}`,
    description: `${site.founder} — Junior Software Developer based in Turnhout. Full-stack, automation and AI work behind AZEC Digital.`,
  };
}

const workEntries = experience.filter(
  (e) => e.type === "work" || e.type === "studio",
);
const educationEntries = experience.filter((e) => e.type === "education");

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations("aboutPage");

  // Resolve the bilingual data files for the active locale before passing
  // to the (unchanged) presentational components.
  const chips = resolveLocalizedDeep(roleChips, activeLocale);
  const profile = resolveLocalizedDeep(profileParagraphs, activeLocale);
  const focus = resolveLocalizedDeep(focusAreas, activeLocale);
  const stack = resolveLocalizedDeep(capabilities, activeLocale);
  const work = resolveLocalizedDeep(workEntries, activeLocale);
  const education = resolveLocalizedDeep(educationEntries, activeLocale);

  const resolvedShelfProjects = resolveProjectsCardMedia(
    getProjects(activeLocale),
  );

  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <AboutHero
        index="02"
        eyebrow={t("heroEyebrow")}
        title={site.founder}
        chips={chips}
        intro={t("heroIntro")}
        availability={`${site.location} · ${site.availability}`}
        portrait={{
          src: "/portrait/yannis.jpg",
          alt: `${site.founder} — portrait`,
          initials: "YB",
        }}
      />

      {/* ── 2. Profile ────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-eyebrow flex items-center gap-3">
                <span className="text-accent">A</span>
                <span className="h-px w-6 bg-faint" />
                <span>{t("profileEyebrow")}</span>
              </span>
              <h2 className="mt-5 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2rem]">
                {t("profileTitle")}
              </h2>
            </div>
            <div className="flex flex-col gap-5 text-[16px] leading-[1.7] text-foreground/90 lg:col-span-8 sm:text-[17px] sm:leading-[1.72]">
              {profile.map((p, i) => (
                <p key={i} className="max-w-2xl text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. Relevant background ────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="B"
            eyebrow={t("backgroundEyebrow")}
            title={t("backgroundTitle")}
            subtitle={t("backgroundSubtitle")}
          />
          <div className="mt-12 sm:mt-14">
            <BackgroundSection items={work} />
          </div>
        </Container>
      </section>

      {/* ── 4. Education ──────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="C"
            eyebrow={t("educationEyebrow")}
            title={t("educationTitle")}
            subtitle={t("educationSubtitle")}
          />
          <div className="mt-12 sm:mt-14">
            <Timeline items={education} />
          </div>
        </Container>
      </section>

      {/* ── 5. Technical stack ────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="D"
            eyebrow={t("stackEyebrow")}
            title={t("stackTitle")}
            subtitle={t("stackSubtitle")}
          />
          <div className="mt-12 sm:mt-14">
            <CapabilityGrid capabilities={stack} />
          </div>
        </Container>
      </section>

      {/* ── 6. Project shelf ──────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="E"
            eyebrow={t("shelfEyebrow")}
            title={t("shelfTitle")}
            subtitle={t("shelfSubtitle")}
          />
          <div className="mt-12 sm:mt-14">
            <ProjectShelf items={resolvedShelfProjects} />
          </div>
        </Container>
      </section>

      {/* ── 7. Focus areas ────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="F"
            eyebrow={t("focusEyebrow")}
            title={t("focusTitle")}
            subtitle={t("focusSubtitle")}
          />
          <div className="mt-12 sm:mt-14">
            <FocusGrid areas={focus} />
          </div>
        </Container>
      </section>

      {/* ── 8. CTA ────────────────────────────────────────────────── */}
      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primary={{ label: t("ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("ctaSecondary"), href: "/projects" }}
      />
    </>
  );
}
