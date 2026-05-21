import type { Project } from "@/lib/types";

/**
 * Single source of truth for portfolio projects.
 *
 * The home page derives its lists from here:
 *   - <FeaturedProjects />  -> projects.filter(p => p.featured)
 *   - <OtherProjects />     -> projects.filter(p => !p.featured)
 *
 * Add a new project by appending an entry. Toggle `featured` to promote it.
 * The order in this array is the order shown on the page.
 *
 * NOTE: Some fields (links, exact year, role) are placeholders — replace
 * with real values when the public versions are ready.
 */
export const projects: Project[] = [
  {
    slug: "az-turnhout-tooling",
    title: "AZ Turnhout — internal tooling",
    tagline: "Custom internal applications for a regional hospital.",
    description:
      "A suite of internal tools built to streamline operational workflows at AZ Turnhout — from scheduling utilities to data dashboards. Designed for clarity, reliability, and the realities of day-to-day clinical use.",
    role: "Developer",
    year: 2025,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    highlights: [
      "Reduced manual coordination overhead for several internal teams",
      "Built with strict access controls and audit-friendly logging",
    ],
    status: "private",
    featured: true,
    accent: "cyan",
  },
  {
    slug: "jarvis",
    title: "Jarvis — AI assistant",
    tagline: "A personal AI assistant for productivity and automation.",
    description:
      "A modular AI assistant designed to handle scheduling, knowledge lookup, and small daily automations. Built to be extensible — new skills plug in as discrete modules without touching the core runtime.",
    role: "Creator",
    year: 2025,
    stack: ["TypeScript", "Node.js", "LLM APIs", "Next.js"],
    highlights: [
      "Plug-in architecture for adding new skills without core changes",
      "Streaming responses with structured tool-use",
    ],
    status: "in-progress",
    featured: true,
    accent: "blue",
    links: {},
  },
  {
    slug: "jansen-car-detailing",
    title: "Jansen Car Detailing",
    tagline: "A premium marketing site for a local detailing studio.",
    description:
      "A modern, conversion-focused website for Jansen Car Detailing — clear service presentation, polished mobile experience, and content that's easy for the owner to maintain. Built to feel as premium as the work.",
    role: "Lead developer & designer",
    year: 2025,
    stack: ["Next.js", "TypeScript", "Tailwind"],
    highlights: [
      "Service catalogue driven by structured data",
      "Optimised for fast loads on mobile networks",
    ],
    status: "live",
    featured: true,
    accent: "cyan",
    links: {},
  },
  {
    slug: "bouldering-app",
    title: "Bouldering tracker",
    tagline: "Log routes, track progress, and review your climbing sessions.",
    description:
      "A mobile-first app for indoor bouldering — log attempts, tag routes by grade and gym, and visualise progress over time. Born from a personal need; built with a clean, focused UX.",
    role: "Creator",
    year: 2026,
    stack: ["React Native", "TypeScript", "SQLite"],
    highlights: [
      "Offline-first data layer",
      "Session-based analytics with grade-progression charts",
    ],
    status: "in-progress",
    featured: true,
    accent: "violet",
  },
];

/** Convenience helpers used by sections — keeps filtering logic out of components. */
export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
