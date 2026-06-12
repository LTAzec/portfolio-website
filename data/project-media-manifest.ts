/**
 * Project card + basic case-study gallery media under `public/projects/`.
 * Regenerate from disk: npm run media:discover
 */
import type {
  CaseStudyVideoRef,
  EditorialImageRef,
  ProjectMedia,
} from "@/lib/types";

export interface ProjectMediaManifestEntry {
  card?: ProjectMedia;
  gallery: EditorialImageRef[];
  galleryVideos: CaseStudyVideoRef[];
}

const JANSEN = "/projects/jansen-car-detailing";

// Aria (formerly Jarvis) and BoulderBuddy (formerly "bouldering-app")
// wire their media explicitly in data/projects.ts — their assets live
// outside /projects/<slug>/ (under /project_afbeeldingen/<Folder>/),
// so no manifest entry is needed for either.

export const projectMediaBySlug: Record<string, ProjectMediaManifestEntry> = {
  "jansen-car-detailing": {
    card: {
      type: "video",
      src: `${JANSEN}/hero.mp4`,
      alt: "Jansen Car Detailing — marketing site",
    },
    gallery: [],
    galleryVideos: [
      {
        src: `${JANSEN}/site.mp4`,
        alt: "Jansen Car Detailing homepage",
        caption: "site · loop",
      },
      {
        src: `${JANSEN}/services.mp4`,
        alt: "Services catalogue",
        caption: "services · loop",
      },
      {
        src: `${JANSEN}/about.mp4`,
        alt: "About the studio",
        caption: "about · loop",
      },
    ],
  },
};
