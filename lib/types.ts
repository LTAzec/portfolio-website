/**
 * Shared domain types. Keeping all data-shape definitions here means
 * the `data/` modules and the components that consume them stay aligned.
 */

export type ProjectStatus = "live" | "in-progress" | "private" | "concept";

export interface ProjectLinks {
  live?: string;
  repo?: string;
  case?: string; // future detail page route, e.g. /projects/jarvis
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
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Short identifier used to pick an icon component, e.g. "github". */
  icon: "github" | "linkedin" | "mail" | "x";
}
