import type { Capability } from "@/lib/types";

/**
 * Capability categories — used on the home page section and on
 * the About page. Single source so both stay in sync.
 */
export const capabilities: Capability[] = [
  {
    title: "Frontend",
    description:
      "Building polished, performant interfaces with modern React — accessible, responsive, considered.",
    items: ["React", "Next.js", "TypeScript", "Tailwind", "Motion", "A11y"],
  },
  {
    title: "Backend & Databases",
    description:
      "Designing scalable APIs, data models, auth flows and the wiring that holds everything together.",
    items: ["Node.js", "PostgreSQL", "REST", "Auth", "Edge runtime"],
  },
  {
    title: "Automation & Tooling",
    description:
      "Internal CLIs, CI pipelines and developer ergonomics — the quiet infrastructure that compounds.",
    items: ["GitHub Actions", "CLI scripts", "CI/CD", "DX tooling"],
  },
  {
    title: "AI & Experiments",
    description:
      "LLM-powered features, structured tool use and agentic workflows shipped into real products.",
    items: ["LLM APIs", "Tool use", "RAG", "Agents", "Prompt design"],
  },
  {
    title: "Product & UI Thinking",
    description:
      "Information architecture, usability and the small details that decide whether software feels professional.",
    items: ["IA", "Usability", "Design systems", "Editorial UX"],
  },
];
