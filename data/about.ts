/**
 * About-page content. Kept separate from the home-page narrative
 * because the about story is biographical, not studio-marketing.
 *
 * NB: project content is intentionally NOT duplicated here. The
 * Personal Projects section pulls directly from `data/projects.ts`
 * via <ProjectShelf />, so adding a project to projects.ts is the
 * only step needed for it to show up on /about.
 */

export interface FocusArea {
  /** Mono numeral, e.g. "01". */
  index: string;
  title: string;
  description: string;
}

/** Hero chip-row — three short identities under the title. */
export const roleChips: string[] = [
  "Junior Software Developer",
  "Product Builder",
  "AZEC Digital",
];

/** Profile paragraphs — written first-person but restrained. */
export const profileParagraphs: string[] = [
  "I'm Yannis Bertels, a Belgium-based developer based in Turnhout. I work end-to-end across full-stack web, mobile and internal tooling, with a soft spot for the parts of software that are usually invisible — automations, migrations, internal CLIs and the quiet plumbing that makes a system reliable in the long run.",
  "Most of what I build lives behind the scenes. Hospital pharmacy tooling. Migration pipelines. AD-bound licence utilities. The kind of software measured by whether someone notices it less over time. AZEC Digital is the umbrella for that work — my personal studio identity for the things I build, ship and keep iterating on.",
  "On the product side, I lean into AI integrations, voice interfaces and sport / climbing technology — the projects I keep coming back to in my own time. They're how I keep my edges sharp on the parts of the stack the day job doesn't always touch.",
];

/** Focus areas — short editorial chips after the projects section. */
export const focusAreas: FocusArea[] = [
  {
    index: "01",
    title: "Internal tooling",
    description:
      "Domain-shaped apps that map onto the real workflow of the people using them — not generic admin panels.",
  },
  {
    index: "02",
    title: "Automation",
    description:
      "Small CLIs, idempotent migrations, scheduled jobs. The quiet leverage that pays compounding returns.",
  },
  {
    index: "03",
    title: "AI integrations",
    description:
      "LLM tool use, voice agents and assistants wired into actual products — not chat demos.",
  },
  {
    index: "04",
    title: "Polished interfaces",
    description:
      "Editorial UI, strong typography, restrained motion. The details that decide whether software feels professional.",
  },
  {
    index: "05",
    title: "Sport & climbing tech",
    description:
      "Personal projects in bouldering, training and movement — the corner of the stack I keep returning to for fun.",
  },
];
