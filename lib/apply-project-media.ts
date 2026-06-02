import { projectMediaBySlug } from "@/data/project-media-manifest";
import type { Project } from "@/lib/types";

/**
 * Merges discovered card/gallery media into project entries.
 * Long-form AZ paths stay explicit in `data/projects.ts`.
 */
export function applyProjectMedia(entries: Project[]): Project[] {
  return entries.map((project) => {
    const extra = projectMediaBySlug[project.slug];
    if (!extra) return project;

    return {
      ...project,
      media: extra.card ?? project.media,
      caseStudy: project.caseStudy
        ? {
            ...project.caseStudy,
            gallery:
              extra.gallery.length > 0
                ? extra.gallery
                : project.caseStudy.gallery,
            galleryVideos:
              extra.galleryVideos.length > 0
                ? extra.galleryVideos
                : project.caseStudy.galleryVideos,
          }
        : project.caseStudy,
    };
  });
}
