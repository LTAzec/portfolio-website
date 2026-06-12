import type { Capability } from "@/lib/types";
import { loc } from "@/lib/i18n";

/**
 * Capability categories — five buckets that map directly to the CV:
 * Languages · Frontend · Backend & Databases · Automation & Tooling · AI & APIs.
 *
 * Used on the home page Capabilities section and on the About page
 * Technical Stack section. Single source so both stay in sync.
 *
 * Titles/descriptions are bilingual via loc(); the `items` tech tags stay
 * as-is (technical names don't translate).
 */
export const capabilities: Capability[] = [
  {
    title: loc("Languages", "Talen"),
    description: loc(
      "Comfortable across compiled and scripted stacks — typed where it pays off, fast where it doesn't.",
      "Thuis in zowel gecompileerde als scripttalen — getypeerd waar het loont, snel waar dat niet nodig is.",
    ),
    items: ["C#", "Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: loc("Frontend", "Frontend"),
    description: loc(
      "Modern React on web and mobile. Component-driven, responsive by default, accessible where it matters.",
      "Moderne React op web en mobiel. Componentgedreven, standaard responsive, toegankelijk waar het telt.",
    ),
    items: ["React", "Next.js", "React Native", "Tailwind", "TypeScript"],
  },
  {
    title: loc("Backend & Databases", "Backend & databases"),
    description: loc(
      "Relational data models, clean APIs and the wiring that holds them together — from .NET services to Node-backed Next.js routes.",
      "Relationele datamodellen, nette API's en de bedrading die alles samenhoudt — van .NET-services tot Next.js-routes op Node.",
    ),
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
    title: loc("Automation & Tooling", "Automatisering & tooling"),
    description: loc(
      "Small scripts, internal CLIs and the quiet infrastructure that compounds — Git workflows, PowerShell utilities, idempotent migrations.",
      "Kleine scripts, interne CLI's en de stille infrastructuur die zich opstapelt — Git-workflows, PowerShell-tools, idempotente migraties.",
    ),
    items: ["PowerShell", "Git / GitHub", "CLI scripts", "Migrations"],
  },
  {
    title: loc("AI & APIs", "AI & API's"),
    description: loc(
      "LLM-powered features shipped into real products — structured tool use, voice agents, prompt design and the glue around third-party APIs.",
      "LLM-functies opgeleverd in échte producten — gestructureerde tool use, voice-agents, promptontwerp en de lijm rond externe API's.",
    ),
    items: ["OpenAI API", "LLM tool use", "Voice agents", "Prompt design"],
  },
];
