import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/ui/CTASection";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { getFeaturedProjects, getOtherProjects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectsPage" });
  return {
    title: `${t("metaTitle")} — ${site.name}`,
    description: t("metaDescription"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations("projectsPage");

  const featuredProjects = getFeaturedProjects(activeLocale);
  const otherProjects = getOtherProjects(activeLocale);
  const featured = resolveProjectsCardMedia(featuredProjects);
  const other = resolveProjectsCardMedia(otherProjects);

  return (
    <>
      <PageHeader
        index="04"
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        subtitle={t("headerSubtitle")}
      />

      {/* Featured projects */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="text-eyebrow flex items-baseline justify-between border-b border-border pb-4">
            <span>
              <span className="text-accent">●</span>{" "}
              <span className="ml-2">{t("featured")}</span>
            </span>
            <span className="text-faint">
              {t("entries", {
                count: String(featuredProjects.length).padStart(2, "0"),
              })}
            </span>
          </div>

          <div className="mt-2">
            <ProjectGrid projects={featured} />
          </div>
        </Container>
      </section>

      {/* Other projects */}
      {otherProjects.length > 0 && (
        <section className="border-t border-border pb-16 sm:pb-24">
          <Container>
            <div className="text-eyebrow flex items-baseline justify-between border-b border-border pt-12 pb-4">
              <span>{t("otherWork")}</span>
              <span className="text-faint">
                {t("entries", {
                  count: String(otherProjects.length).padStart(2, "0"),
                })}
              </span>
            </div>

            <div className="mt-2">
              <ProjectGrid projects={other} layout="compact" />
            </div>
          </Container>
        </section>
      )}

      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primary={{ label: t("ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("ctaSecondary"), href: "/about" }}
      />
    </>
  );
}
