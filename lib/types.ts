/**
 * Shared domain types. Keeping all data-shape definitions here means
 * the `data/` modules and the components that consume them stay aligned.
 */

export type ProjectStatus = "live" | "in-progress" | "private" | "concept";

export interface ProjectLinks {
  live?: string;
  repo?: string;
  case?: string;
}

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problem: string;
  solution: string;
  result: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  role?: string;
  year: number;
  stack: string[];
  highlights?: string[];
  status: ProjectStatus;
  featured: boolean;
  links?: ProjectLinks;
  image?: string;
  accent?: "cyan" | "blue" | "violet";
  media?: ProjectMedia;
  caseStudy?: ProjectCaseStudy;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "x";
}

/** Capability category used by the Capabilities section and About page. */
export interface Capability {
  title: string;
  description: string;
  items: string[];
}

/** Timeline entry used by the About page's experience/education timeline. */
export interface TimelineItem {
  year: string;
  title: string;
  meta?: string;
  description?: string;
  type: "work" | "education" | "studio" | "milestone";
}
