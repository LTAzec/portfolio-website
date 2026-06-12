/**
 * About-page content. Kept separate from the home-page narrative
 * because the about story is biographical, not studio-marketing.
 *
 * NB: project content is intentionally NOT duplicated here. The
 * Personal Projects section pulls directly from `data/projects.ts`
 * via <ProjectShelf />, so adding a project to projects.ts is the
 * only step needed for it to show up on /about.
 */

import { loc, locArr } from "@/lib/i18n";

export interface FocusArea {
  /** Mono numeral, e.g. "01". */
  index: string;
  title: string;
  description: string;
}

/** Hero chip-row — three short identities under the title. */
export const roleChips: string[] = locArr(
  ["Junior Software Developer", "Product Builder", "AZEC Digital"],
  ["Junior software developer", "Product builder", "AZEC Digital"],
);

/** Profile paragraphs — written first-person but restrained. */
export const profileParagraphs: string[] = locArr(
  [
    "I'm Yannis Bertels, a Belgium-based developer based in Turnhout. I work end-to-end across full-stack web, mobile and internal tooling, with a soft spot for the parts of software that are usually invisible — automations, migrations, internal CLIs and the quiet plumbing that makes a system reliable in the long run.",
    "Most of what I build lives behind the scenes. Hospital pharmacy tooling. Migration pipelines. AD-bound licence utilities. The kind of software measured by whether someone notices it less over time. AZEC Digital is the umbrella for that work — my personal studio identity for the things I build, ship and keep iterating on.",
    "On the product side, I lean into AI integrations, voice interfaces and sport / climbing technology — the projects I keep coming back to in my own time. They're how I keep my edges sharp on the parts of the stack the day job doesn't always touch.",
  ],
  [
    "Ik ben Yannis Bertels, een developer uit Turnhout. Ik werk end-to-end aan full-stack web, mobiel en interne tooling, met een voorliefde voor de delen van software die meestal onzichtbaar zijn — automatiseringen, migraties, interne CLI's en het stille leidingwerk dat een systeem op lange termijn betrouwbaar houdt.",
    "Het meeste van wat ik bouw, draait achter de schermen. Tooling voor een ziekenhuisapotheek. Migratiepipelines. Licentietools gekoppeld aan Active Directory. Het soort software dat je afmeet aan de mate waarin mensen het na verloop van tijd minder opmerken. AZEC Digital is de paraplu voor dat werk — mijn persoonlijke studio-identiteit voor de dingen die ik bouw, oplever en blijf verbeteren.",
    "Aan de productkant trek ik naar AI-integraties, voice-interfaces en sport- en klimtechnologie — de projecten waar ik in mijn eigen tijd steeds op terugkom. Zo houd ik mezelf scherp op de delen van de stack die het dagelijkse werk niet altijd raakt.",
  ],
);

/** Focus areas — short editorial chips after the projects section. */
export const focusAreas: FocusArea[] = [
  {
    index: "01",
    title: loc("Internal tooling", "Interne tooling"),
    description: loc(
      "Domain-shaped apps that map onto the real workflow of the people using them — not generic admin panels.",
      "Apps die op het echte werkproces van de gebruikers zijn afgestemd — geen generieke adminpanelen.",
    ),
  },
  {
    index: "02",
    title: loc("Automation", "Automatisering"),
    description: loc(
      "Small CLIs, idempotent migrations, scheduled jobs. The quiet leverage that pays compounding returns.",
      "Kleine CLI's, idempotente migraties, geplande taken. De stille hefboom die op termijn blijft opbrengen.",
    ),
  },
  {
    index: "03",
    title: loc("AI integrations", "AI-integraties"),
    description: loc(
      "LLM tool use, voice agents and assistants wired into actual products — not chat demos.",
      "LLM-tool use, voice-agents en assistenten ingebouwd in échte producten — geen chatdemo's.",
    ),
  },
  {
    index: "04",
    title: loc("Polished interfaces", "Verzorgde interfaces"),
    description: loc(
      "Editorial UI, strong typography, restrained motion. The details that decide whether software feels professional.",
      "Editoriale UI, sterke typografie, ingetogen beweging. De details die bepalen of software professioneel aanvoelt.",
    ),
  },
  {
    index: "05",
    title: loc("Sport & climbing tech", "Sport- en klimtech"),
    description: loc(
      "Personal projects in bouldering, training and movement — the corner of the stack I keep returning to for fun.",
      "Persoonlijke projecten rond bouldering, training en beweging — de hoek van de stack waar ik voor de lol op terugkom.",
    ),
  },
];
