import type { Project } from "@/lib/types";

/**
 * Single source of truth for portfolio projects.
 * Featured projects render in <FeaturedProjects /> and on /projects.
 * Each project has a case study page at /projects/[slug].
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
    caseStudy: {
      overview:
        "AZ Turnhout is a regional Belgian hospital that runs multiple internal teams with overlapping coordination needs. The brief was a small suite of internal tools that slot into existing workflows without becoming yet another system to maintain.",
      problem:
        "Several teams ran coordination through spreadsheets, ad-hoc messages and tribal knowledge. Important details slipped between cracks; new staff took weeks to ramp up.",
      solution:
        "A focused set of internal apps designed around real day-to-day operations. Each tool covers one specific workflow with strict access controls, audit-friendly logging, and a UI that reads more like a clinical instrument than a generic admin panel.",
      result:
        "Reduced manual coordination overhead, faster ramp-up for new staff, and a clean audit trail across critical workflows. The system is now part of how the involved teams actually work.",
    },
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
    caseStudy: {
      overview:
        "Jarvis is an in-progress personal AI assistant designed around modular skills — discrete capabilities that plug in without touching the core runtime.",
      problem:
        "Most AI assistants are either too generic (chat with no real abilities) or too rigid (a single workflow hard-coded). Adding new capabilities usually means rewriting the core.",
      solution:
        "A skill-pluggable architecture where each capability (scheduling, lookup, automation) is a self-contained module conforming to a small contract. The runtime handles streaming, tool use and orchestration; skills focus on their domain.",
      result:
        "Adding a new skill takes a single file and a registration entry. The assistant has shipped scheduling, knowledge lookup and a growing set of personal automations.",
    },
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
    caseStudy: {
      overview:
        "Jansen Car Detailing is a Belgian detailing studio. The brief was a marketing site that feels as premium as the work — clear service presentation, fast mobile experience, and content the owner can maintain.",
      problem:
        "An ageing site that didn't reflect the quality of the actual detailing work. Conversion was low; the owner couldn't update copy without developer help.",
      solution:
        "A fresh marketing site with a structured service catalogue, polished mobile experience, and a content layer the owner controls directly. Built with Next.js and Tailwind for fast loads on mobile networks.",
      result:
        "Visibly more bookings, more direct contact through the site, and a maintenance workflow that no longer requires developer involvement for ordinary content updates.",
    },
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
    caseStudy: {
      overview:
        "A mobile-first app for indoor bouldering — track attempts, tag routes by grade and gym, and visualise progress over time. Born from a personal need to keep climbing sessions honest.",
      problem:
        "Existing climbing apps are bloated with social features and forget the basics: fast logging, offline reliability and clean analytics.",
      solution:
        "An offline-first React Native app with a focused UX: log an attempt in seconds, tag routes by grade and gym, see clean session-based analytics and grade-progression charts. No social, no feed, no noise.",
      result:
        "Personal climbing sessions are now consistently logged with minimal friction. The grade-progression view is genuinely useful for spotting plateaus and pushing through them.",
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
