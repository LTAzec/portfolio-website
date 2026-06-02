import type { TimelineItem } from "@/lib/types";

/**
 * Background entries for the About page. Sourced from the actual CV.
 * Filtered downstream by `type`:
 *   - "work" / "studio" → BackgroundSection (featured + compact rows)
 *   - "education"       → Education Timeline
 *
 * The AZ Turnhout entry is the featured one — the rest are deliberately
 * compact so the section reads honestly (one real software role, with
 * supporting context) rather than padding three jobs into the same weight.
 */
export const experience: TimelineItem[] = [
  {
    year: "2024 — 2025",
    title: "Software Engineering Internship",
    meta: "AZ Turnhout — regional hospital",
    category: "Software",
    featured: true,
    body: [
      "Internship in the pharmacy department at AZ Turnhout. End-to-end build of the internal tooling around their bereidings-logboek — a SQL Server back-end with a repository layer of stored procedures, a Next.js front-end for daily use, a Python pipeline that migrated the legacy FileMaker data into the new schema, and a small PowerShell tool for AD-bound Microsoft 365 licence management.",
      "What it actually taught me: how internal software is used in practice. Non-technical users, fragile existing workflows, and a strong need for idempotent migrations, audit-friendly logging and a UI that maps onto the paper rhythm people already trust. Most of the value was in the unglamorous parts — making the flow not break, not in shipping new features.",
    ],
    description:
      "Internal pharmacy tooling — SQL Server, Next.js, Python migration pipeline and a PowerShell licence utility. Real users, real workflows, end-to-end ownership.",
    type: "work",
  },
  {
    year: "2023 — 2024",
    title: "First Line Support",
    meta: "CMC",
    category: "Support",
    description:
      "First-line IT support — diagnosing incidents, walking non-technical users through fixes, and translating vague problem reports into clear next steps. Where I learned to listen first and reach for the keyboard second.",
    type: "work",
  },
  {
    year: "Seasonal",
    title: "Snowboard Instructor · Animator",
    meta: "Ski & Snowboard Kempen",
    category: "Coaching",
    description:
      "Teaching snowboard groups across all levels. Reading a room, breaking complex movements into steps, keeping a group calm and confident. The same soft skills that show up later when explaining a refactor or migration to a non-technical stakeholder.",
    type: "work",
  },
  {
    year: "2022 — 2025",
    title: "Associate Degree · Programmeren",
    meta: "Thomas More — Geel",
    description:
      "Three-year associate programme focused on software development: object-oriented programming, databases, REST APIs, full-stack web and mobile, and applied real-world projects. Foundation for everything in the studio today.",
    type: "education",
  },
];
