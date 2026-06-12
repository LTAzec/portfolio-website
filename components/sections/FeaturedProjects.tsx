import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedProjects, getProjects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";

/**
 * Selected work — editorial case-study list on the home page.
 * Delegates rendering to <ProjectGrid /> so the same row layout is
 * reused on the /projects overview page.
 *
 * Closes with a "View all projects" link to the dedicated index page,
 * making the multi-page structure of the site obvious.
 */
export async function FeaturedProjects() {
  const requested = await getLocale();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const t = await getTranslations("featured");

  const featuredProjects = getFeaturedProjects(locale);
  const allProjects = getProjects(locale);
  const resolvedFeatured = resolveProjectsCardMedia(featuredProjects);
  const hasMore = allProjects.length > featuredProjects.length;

  const featuredLabel = String(featuredProjects.length).padStart(2, "0");
  const totalLabel = String(allProjects.length).padStart(2, "0");

  return (
    <section id="projects" className="relative py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          index="04"
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16">
          <ProjectGrid projects={resolvedFeatured} />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-eyebrow text-[10px]">
            {hasMore
              ? t("showing", { shown: featuredLabel, total: totalLabel })
              : t("featuredCount", { count: featuredLabel })}
          </span>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
          >
            {t("viewAll")}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
