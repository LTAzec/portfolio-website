import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/sections/CaseStudy";
import { LongFormCaseStudy } from "@/components/case-study/LongFormCaseStudy";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();
  const project = projects[idx];
  const nextProject = projects[(idx + 1) % projects.length];

  // Long-form study takes over when the payload is present; otherwise we
  // fall back to the generic editorial layout.
  if (project.caseStudy?.longForm) {
    return <LongFormCaseStudy project={project} nextProject={nextProject} />;
  }
  return <CaseStudy project={project} nextProject={nextProject} />;
}
