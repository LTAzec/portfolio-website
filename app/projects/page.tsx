import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { CTASection } from "@/components/ui/CTASection";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { featuredProjects, otherProjects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Projects — ${site.name}`,
  description:
    "All projects by AZEC Digital — internal tooling, AI products, web experiences and personal experiments.",
};

export default function ProjectsPage() {
  const featured = resolveProjectsCardMedia(featuredProjects);
  const other = resolveProjectsCardMedia(otherProjects);

  return (
    <>
      <PageHeader
        index="04"
        eyebrow="Projects"
        title="All {projects}, shipped end-to-end."
        subtitle="A complete index of work — internal tooling, AI products, marketing sites and personal experiments. Each project links to a full case study."
      />

      {/* Featured projects */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="text-eyebrow flex items-baseline justify-between border-b border-border pb-4">
            <span>
              <span className="text-accent">●</span>{" "}
              <span className="ml-2">Featured</span>
            </span>
            <span className="text-faint">
              {String(featuredProjects.length).padStart(2, "0")} entries
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
              <span>Other work</span>
              <span className="text-faint">
                {String(otherProjects.length).padStart(2, "0")} entries
              </span>
            </div>

            <div className="mt-2">
              <ProjectGrid projects={other} layout="compact" />
            </div>
          </Container>
        </section>
      )}

      <CTASection
        eyebrow="Open for work"
        title="Have a project that fits the studio? {Let's talk.}"
        subtitle="The studio takes on a small number of projects per year. Get in touch with a brief and we'll see if there's a good fit."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "More about the studio", href: "/about" }}
      />
    </>
  );
}
