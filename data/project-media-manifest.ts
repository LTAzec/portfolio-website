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

const JARVIS = "/projects/jarvis";
const JANSEN = "/projects/jansen-car-detailing";
const BOULDER = "/projects/bouldering-app";

export const projectMediaBySlug: Record<string, ProjectMediaManifestEntry> = {
  jarvis: {
    card: {
      type: "video",
      src: `${JARVIS}/hero.mp4`,
      alt: "Jarvis — AI assistant interface",
    },
    gallery: [],
    galleryVideos: [
      {
        src: `${JARVIS}/chat.mp4`,
        alt: "Jarvis chat interface",
        caption: "chat · loop",
      },
      {
        src: `${JARVIS}/demo.mp4`,
        alt: "Jarvis demo session",
        caption: "demo · loop",
      },
      {
        src: `${JARVIS}/jarvis.mp4`,
        alt: "Jarvis overview",
        caption: "jarvis · loop",
      },
      {
        src: `${JARVIS}/skills.mp4`,
        alt: "Jarvis skills module",
        caption: "skills · loop",
      },
    ],
  },
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
  "bouldering-app": {
    card: {
      type: "video",
      src: `${BOULDER}/demo.mp4`,
      alt: "Bouldering tracker — app demo",
    },
    gallery: [],
    galleryVideos: [
      {
        src: `${BOULDER}/app.mp4`,
        alt: "Bouldering tracker home screen",
        caption: "app · loop",
      },
      {
        src: `${BOULDER}/log.mp4`,
        alt: "Session logging flow",
        caption: "log · loop",
      },
      {
        src: `${BOULDER}/stats.mp4`,
        alt: "Grade progression analytics",
        caption: "stats · loop",
      },
    ],
  },
};
