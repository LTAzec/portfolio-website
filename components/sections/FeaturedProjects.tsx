import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProjects, projects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";

/**
 * Selected work — editorial case-study list on the home page.
 * Delegates rendering to <ProjectGrid /> so the same row layout is
 * reused on the /projects overview page.
 *
 * Closes with a "View all projects" link to the dedicated index page,
 * making the multi-page structure of the site obvious.
 */
export function FeaturedProjects() {
  const resolvedFeatured = resolveProjectsCardMedia(featuredProjects);
  const hasMore = projects.length > featuredProjects.length;

  return (
    <section id="projects" className="relative py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title="Recent {projects} — shipped end-to-end."
          subtitle="A snapshot of recent work — internal tooling, AI products, marketing sites and personal projects."
        />

        <div className="mt-16">
          <ProjectGrid projects={resolvedFeatured} />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <span className="text-eyebrow text-[10px]">
            {hasMore
              ? `Showing ${String(featuredProjects.length).padStart(2, "0")} of ${String(projects.length).padStart(2, "0")}`
              : `${String(featuredProjects.length).padStart(2, "0")} featured`}
          </span>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
          >
            View all projects
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
