import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { CaseStudy } from "@/components/sections/CaseStudy";
import { LongFormCaseStudy } from "@/components/case-study/LongFormCaseStudy";
import { getProjects, projectSlugs } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Slugs are locale-independent; the [locale] param is supplied by the
// parent layout's generateStaticParams, so Next composes both locales.
export function generateStaticParams(): { slug: string }[] {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const activeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const project = getProjects(activeLocale).find((p) => p.slug === slug);
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
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const activeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const projects = getProjects(activeLocale);
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
