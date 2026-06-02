import type { Capability } from "@/lib/types";

/**
 * Capability categories — five buckets that map directly to the CV:
 * Languages · Frontend · Backend & Databases · Automation & Tooling · AI & APIs.
 *
 * Used on the home page Capabilities section and on the About page
 * Technical Stack section. Single source so both stay in sync.
 */
export const capabilities: Capability[] = [
  {
    title: "Languages",
    description:
      "Comfortable across compiled and scripted stacks — typed where it pays off, fast where it doesn't.",
    items: ["C#", "Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Frontend",
    description:
      "Modern React on web and mobile. Component-driven, responsive by default, accessible where it matters.",
    items: ["React", "Next.js", "React Native", "Tailwind", "TypeScript"],
  },
  {
    title: "Backend & Databases",
    description:
      "Relational data models, clean APIs and the wiring that holds them together — from .NET services to Node-backed Next.js routes.",
    items: [
      ".NET",
      "Entity Framework",
      "SQL Server",
      "PostgreSQL",
      "Prisma ORM",
      "REST APIs",
    ],
  },
  {
    title: "Automation & Tooling",
    description:
      "Small scripts, internal CLIs and the quiet infrastructure that compounds — Git workflows, PowerShell utilities, idempotent migrations.",
    items: ["PowerShell", "Git / GitHub", "CLI scripts", "Migrations"],
  },
  {
    title: "AI & APIs",
    description:
      "LLM-powered features shipped into real products — structured tool use, voice agents, prompt design and the glue around third-party APIs.",
    items: ["OpenAI API", "LLM tool use", "Voice agents", "Prompt design"],
  },
];
