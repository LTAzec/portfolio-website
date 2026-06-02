import type {
  CaseStudyVideoRef,
  EditorialImageRef,
  LongFormCaseStudy,
  Project,
  ProjectMedia,
} from "@/lib/types";
import { assetExists } from "@/lib/asset-utils";
import { discoverInternalProjectMedia } from "@/lib/discover-internal-project-media";

interface DiscoveredFallback {
  videos: CaseStudyVideoRef[];
  images: EditorialImageRef[];
}

/**
 * Returns the first discoverable media across every internal project on a
 * long-form case study. Search order matches the visual hierarchy: the
 * first internal project in the data array wins.
 */
function collectInternalFallbacks(
  lf: LongFormCaseStudy | undefined,
): DiscoveredFallback {
  if (!lf?.internalProjects?.length) return { videos: [], images: [] };
  const videos: CaseStudyVideoRef[] = [];
  const images: EditorialImageRef[] = [];
  for (const ip of lf.internalProjects) {
    const discovered = discoverInternalProjectMedia(ip);
    videos.push(...discovered.videos);
    images.push(...discovered.images);
  }
  return { videos, images };
}

/**
 * Resolve a project's CARD media (the thumbnail on /projects, /, /about shelf).
 *
 * Fallback chain:
 *   1. The declared `project.media` if its source file is on disk.
 *   2. The first VIDEO discovered across the long-form's internal projects.
 *   3. The first IMAGE discovered across the long-form's internal projects.
 *   4. The declared `project.media` unchanged (lets the renderer fall back to
 *      its engineered placeholder).
 *
 * Pure: returns a shallow-cloned Project when patched, the original otherwise.
 */
export function resolveProjectCardMedia(project: Project): Project {
  if (project.media && assetExists(project.media.src)) return project;

  const { videos, images } = collectInternalFallbacks(
    project.caseStudy?.longForm,
  );

  let resolvedMedia: ProjectMedia | undefined;
  if (videos[0]) {
    resolvedMedia = {
      type: "video",
      src: videos[0].src,
      alt: project.media?.alt ?? `${project.title} — preview`,
    };
  } else if (images[0]) {
    resolvedMedia = {
      type: "image",
      src: images[0].src,
      alt: project.media?.alt ?? `${project.title} — preview`,
    };
  }

  if (!resolvedMedia) return project;
  return { ...project, media: resolvedMedia };
}

/**
 * Resolve a project's HERO media (the large frame inside the case study).
 *
 * Fallback chain:
 *   1. The declared `heroMedia.src` if its file is on disk.
 *   2. The first VIDEO discovered across the long-form's internal projects.
 *   3. The first IMAGE discovered across the long-form's internal projects.
 *   4. The declared heroMedia unchanged.
 *
 * Critically: we DO NOT prefer a hard-coded "canonical" stub at
 * /project_afbeeldingen/az-turnhout/voorraadbeheer-loop.mp4 because it exists
 * on disk as a 29 KB truncated stub that browsers cannot decode — preferring
 * it would render a black frame on top of an otherwise-correct fallback.
 */
export function resolveProjectHeroMedia(project: Project): Project {
  const lf = project.caseStudy?.longForm;
  if (!lf?.heroMedia) return project;
  const declaredSrc =
    lf.heroMedia.kind === "video" ? lf.heroMedia.src : lf.heroMedia.ref.src;
  if (assetExists(declaredSrc)) return project;

  const { videos, images } = collectInternalFallbacks(lf);

  let resolvedHero: LongFormCaseStudy["heroMedia"];
  if (videos[0]) {
    resolvedHero =
      lf.heroMedia.kind === "video"
        ? { ...lf.heroMedia, src: videos[0].src }
        : {
            kind: "video",
            src: videos[0].src,
            alt: videos[0].alt,
            caption: videos[0].caption,
          };
  } else if (images[0]) {
    resolvedHero =
      lf.heroMedia.kind === "image"
        ? { ...lf.heroMedia, ref: { ...lf.heroMedia.ref, src: images[0].src } }
        : {
            kind: "image",
            ref: {
              src: images[0].src,
              slot: images[0].slot,
              alt: images[0].alt,
              caption: images[0].caption,
              aspect: images[0].aspect,
            },
          };
  }

  if (!resolvedHero) return project;

  return {
    ...project,
    caseStudy: {
      ...project.caseStudy!,
      longForm: { ...lf, heroMedia: resolvedHero },
    },
  };
}

/** Convenience: applies card resolution to a list. */
export function resolveProjectsCardMedia(projects: Project[]): Project[] {
  return projects.map(resolveProjectCardMedia);
}
