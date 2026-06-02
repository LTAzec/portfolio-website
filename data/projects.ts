import type { Project } from "@/lib/types";
import { applyProjectMedia } from "@/lib/apply-project-media";

/**
 * Single source of truth for portfolio projects.
 * Featured projects render in <FeaturedProjects /> and on /projects.
 * Each project has a case study page at /projects/[slug].
 *
 * Projects with `caseStudy.longForm` get the editorial long-form layout;
 * everything else falls back to the basic case-study renderer.
 *
 * Static assets live under `public/projects/<slug>/` (public URL `/projects/...`).
 * Card + basic gallery media for Jarvis / Jansen / Bouldering are merged from
 * `data/project-media-manifest.ts` (regenerate: `npm run media:discover`).
 *
 * AZ Turnhout nested folders are not renamed — paths use percent-encoding
 * where directory or file names contain spaces. `assetExists` decodes first.
 */

const AZ_BASE = "/project_afbeeldingen/az-turnhout/Afbeeldingen_Stage";
const AZ_VOORRAAD = `${AZ_BASE}/voorraadbeheer`;
const AZ_LICENSE = `${AZ_BASE}/LicentieTool`;
const AZ_SERVICEDESK = `${AZ_BASE}/ServiceDesk%20Dashboard`;
const AZ_INSTALLER = `${AZ_BASE}/Installer%20tool`;

const AZ_VIDEO_VOORRAAD = `${AZ_VOORRAAD}/voorraadbeheer%20nieuwe%20video%20met%20blur.mp4`;
const AZ_VIDEO_INSTALLER = `${AZ_INSTALLER}/installer%20tool.mp4`;
const AZ_CARD_VIDEO = AZ_VIDEO_VOORRAAD;

// Auto-discovery roots for the four internal-project showcases on the
// AZ Turnhout case-study page. Files dropped into these folders are
// picked up at render time by `discoverInternalProjectMedia`.
const AZ_PROJECTS_BASE = "/project_afbeeldingen/az-turnhout/projects";
const AZ_PROJECT_VOORRAAD = `${AZ_PROJECTS_BASE}/voorraadbeheer`;
const AZ_PROJECT_INSTALLER = `${AZ_PROJECTS_BASE}/Installer%20tool`;
const AZ_PROJECT_LICENSE = `${AZ_PROJECTS_BASE}/LicentieTool`;
const AZ_PROJECT_SERVICEDESK = `${AZ_PROJECTS_BASE}/ServiceDesk%20Dashboard`;

const baseProjects: Project[] = [
  {
    slug: "az-turnhout-tooling",
    title: "AZ Turnhout — internal tooling",
    tagline:
      "Internal applications and migration tooling for the AZ Turnhout pharmacy compounding workflow.",
    description:
      "A focused suite of internal tools around the AZ Turnhout pharmacy compounding workflow — a SQL Server back-end with a repository layer of stored procedures, a Python pipeline that migrates legacy FileMaker data into the new schema, and an internal CLI for AD-bound Microsoft 365 license management.",
    role: "Developer",
    year: 2025,
    stack: [
      "Next.js",
      "TypeScript",
      "SQL Server",
      "Python",
      "PowerShell",
      "Tailwind",
    ],
    highlights: [
      "Repository-style stored-procedure layer on SQL Server — Activate · Delete · Filter · Get · Insert · Sorteer · Update per entity",
      "Idempotent migration pipeline from a legacy FileMaker export through a normalised xlsx staging layer into SQL Server",
      "Audit-friendly logging on every preparation, with strict per-entity permissions",
    ],
    status: "private",
    featured: true,
    accent: "cyan",
    // Wired to the project.media slot so home / projects / about-shelf
    // cards render the real autoplay loop instead of a generic placeholder.
    media: {
      type: "video",
      src: AZ_CARD_VIDEO,
      alt: "AZ Turnhout internal tooling — product preview",
    },
    caseStudy: {
      overview:
        "AZ Turnhout is a regional Belgian hospital. The brief was a small set of internal applications around the pharmacy's preparation logbook — replacing a long-running FileMaker setup with a SQL Server back-end, a Next.js front-end for daily use, and the surrounding migration and operations tooling.",
      problem:
        "The pharmacy ran on a legacy FileMaker database with growing edge-cases, fragile reporting, and no clean way to introduce new workflows. Data integrity drifted over time and onboarding new staff to the existing system was slow.",
      solution:
        "A new SQL Server schema with a repository layer of stored procedures, a Next.js front-end that maps cleanly onto those operations, and a Python migration pipeline that converts the FileMaker export into normalised, idempotent SQL inserts. Alongside the main app, an internal CLI handles AD-bound Microsoft 365 licence assignments for endpoints.",
      result:
        "Compounding records, stamdata and inventory now live in a single auditable system. Migration runs are repeatable; legacy data was lifted across without manual reconciliation. The pharmacy team works from a UI built for their actual workflow rather than a generic admin panel.",

      /* ──────────────────────────────────────────────────────────
         Long-form editorial layout
         ────────────────────────────────────────────────────────── */
      longForm: {
        contextTags: ["Internal", "Healthcare", "Belgium", "Pharmacy compounding"],

        heroMedia: {
          kind: "video",
          src: AZ_VIDEO_VOORRAAD,
          alt: "Voorraadbeheer module — inventory screen in motion",
          caption:
            "Voorraadbeheer · inventory view (looped capture, identifiers redacted at source)",
        },

        /* ── 2. Context ────────────────────────────────────────── */
        context: [
          "AZ Turnhout is a regional hospital in the Kempen. The pharmacy department runs the compounding workflow that prepares patient-specific oncology mixtures — drugs like Fluorouracil, Paclitaxel and Oxaliplatin diluted in NaCl 0.9% or Glucose 5%, each with their own preparation method, holding time and traceability requirements.",
          "Behind that workflow sat a long-lived FileMaker database. It worked, but every new request meant working around it. The brief was to lift the system into a modern stack without disrupting daily operations — a SQL Server back-end, a focused Next.js front-end for the people who actually use it, and a migration path that didn't require manual cleanup.",
          "The audience is internal: pharmacy technicians (bereiders), supervising pharmacists (apothekers), and a small group of admins. Nobody on the floor has time for a clever UI. The product has to read like an instrument, not a dashboard.",
        ],

        /* ── 3. Problem detail ─────────────────────────────────── */
        problemDetail: {
          paragraphs: [
            "The legacy FileMaker export held years of preparation records: every batch with its teller, lot number, preparation date, product, method and solvent. Schema-wise it was flat and tolerant — the fields were strings, the relationships were implicit, and the validation lived in muscle memory.",
            "Beyond the data itself, the harder problem was that the system had no clean seam to extend from. New workflows landed as patches on the existing layout. Filtering and sorting the bereidings-logboek across years, lot numbers and products was slow; reporting required exporting and post-processing in Excel.",
            "Three constraints shaped the rewrite: nothing could be lost in migration, the new system had to be auditable end-to-end, and the daily workflow had to feel familiar — same vocabulary, same shortcuts, same speed of entry.",
          ],
          media: [
            {
              src: `${AZ_VOORRAAD}/1FilemakerRuweOutput.png`,
              slot: "Raw FileMaker export — the starting point of the migration.",
              alt: "Legacy FileMaker export of preparation records",
              caption: "Raw FileMaker export · pre-migration",
              aspect: "aspect-[16/9]",
              mask: "fade-bottom",
              blurZones: [
                { x: 0, y: 38, w: 100, h: 62, intensity: "soft" },
              ],
            },
            {
              src: `${AZ_VOORRAAD}/3MigratieOutput.png`,
              slot: "Normalised xlsx after the Python staging step — the tabbed structure the SQL generator reads from.",
              alt: "Normalised xlsx staging file with preparation rows",
              caption: "migratie_output.xlsx · staging layer",
              aspect: "aspect-[4/3]",
              mask: "fade-bottom",
              blurZones: [
                { x: 0, y: 45, w: 100, h: 55, intensity: "soft" },
              ],
            },
          ],
        },

        /* ── 4. Tooling / Systems ──────────────────────────────── */
        tooling: [
          {
            eyebrow: "01 · Bereidings-logboek",
            title: "Preparation logbook",
            description:
              "The daily-driver view: a filterable, sortable logbook over every batch. Filter on apotheker, bereider, datum, jaar, lotnummer, maand or product; the same dimensions are available as sort orders, both ascending and descending.",
          },
          {
            eyebrow: "02 · Stamdata",
            title: "Stamdata management",
            description:
              "CRUD on the reference tables that anchor every preparation: Producten, Preparations, Oplosmiddelen, BewaarMethodes, Toedieningsvormen, ProductLineDose. Soft deletes via Activate / Delete pairs so nothing disappears from the audit trail.",
          },
          {
            eyebrow: "03 · Voorraadbeheer",
            title: "Inventory module",
            description:
              "Stock and batch tracking layered on top of the preparation data — what was prepared, what's still good (Vervaldatum_batch), what needs to be ordered. Recorded against the same teller / lot numbers as the logbook for full traceability.",
          },
          {
            eyebrow: "04 · License CLI",
            title: "AZT License Management Tool",
            description:
              "A small PowerShell tool that binds a computer's AD object to the right Microsoft 365 licence groups (AG_* / MG_*). Interactive add / remove flow with a preview step before mutations land in AD — operations are logged with timestamps.",
            media: {
              src: `${AZ_LICENSE}/LicentieScript.png`,
              slot: "Terminal capture of the License Management Tool",
              alt: "PowerShell licence management CLI",
              aspect: "aspect-[16/9]",
            },
          },
          {
            eyebrow: "05 · Service Desk",
            title: "Service Desk dashboard",
            description:
              "An internal dashboard for IT support — current incident queue, recent resolutions and a quick overview of system health, built on the same component vocabulary as the rest of the suite so support staff don't have to learn a new UI.",
            media: {
              src: `${AZ_SERVICEDESK}/Servicedesk%20Dashboard.png`,
              slot: "Service Desk dashboard — current queue and recent activity",
              alt: "Service Desk internal dashboard",
              aspect: "aspect-[16/9]",
              mask: "fade-bottom",
            },
          },
          {
            eyebrow: "06 · Installer",
            title: "Endpoint installer tool",
            description:
              "A guided installer for the standard AZT software baseline on new endpoints. Wraps the existing PowerShell deploy steps in a clear UI with progress feedback, so the same workflow runs the same way for every machine.",
          },
        ],

        /* ── 5. Engineering approach ───────────────────────────── */
        engineering: [
          {
            index: "01",
            title: "Repository-style stored procedures",
            body: "Every entity has the same vocabulary of operations: Activate, Delete, Filter, Get, Insert, Sorteer, Update. The front-end never writes raw SQL — it calls a named procedure with a fixed parameter shape, which keeps the data layer predictable and the audit story simple.",
          },
          {
            index: "02",
            title: "Idempotent migrations",
            body: "Every generated INSERT is wrapped in IF NOT EXISTS guards against the right business key. A migration run can be repeated against the same database without producing duplicates, which made testing the import on a copy of production cheap and safe.",
          },
          {
            index: "03",
            title: "Python staging layer",
            body: "Migration goes via a normalised xlsx staging file with one tab per logical table — Controle, Producten, Methodes, Oplosmiddelen, Preparations, DoseVolume. Pandas does the cleaning; a separate generator produces the SQL. Failures show up in staging, not in production.",
          },
          {
            index: "04",
            title: "Audit-friendly logbook",
            body: "Bereidings_logboek stores Dose_Id, BereiderId, ApothekerId, DatumTijd, LotNummer, Vervaldatum_batch, BereidingsNummer, Teller and Opmerkingen for every batch. Updates land as explicit UPDATE statements scoped on teller + nummer + timestamp — never blind overwrites.",
          },
          {
            index: "05",
            title: "AD-bound permissions",
            body: "Privileged operations — the licence CLI, certain admin views — run against AD identity. The CLI reads the current memberships before mutating, surfaces a preview, and only applies on explicit confirmation. Nothing happens implicitly.",
          },
          {
            index: "06",
            title: "Built for the pharmacy floor",
            body: "Form design follows the existing paper rhythm: teller → product → preparation → solvent → volume → lot → expiry. The vocabulary is Dutch where the staff already uses Dutch (apotheker, bereider, oplosmiddel) and English where the codebase is English. Familiarity beats novelty.",
          },
        ],

        /* ── 6. Visual showcase ────────────────────────────────── */
        showcase: [
          {
            variant: "video",
            eyebrow: "Showcase · 01",
            heading: "Inventory in motion",
            body: "Short loop of the voorraadbeheer module. Identifiers are blurred at source; the surrounding UI and flow are unmodified.",
            video: {
              src: AZ_VIDEO_VOORRAAD,
              alt: "Voorraadbeheer module — looped capture",
              caption: "voorraadbeheer · autoplay · muted · looping",
            },
          },
          {
            variant: "single",
            eyebrow: "Showcase · 02",
            heading: "License management, in a terminal",
            body: "The AZT License Management Tool — pick a computer, see its current memberships, choose AG_/MG_ groups to add, review the preview, confirm. Sensitive identifiers (computer DN, user, group container) are blurred at source.",
            media: [
              {
                src: `${AZ_LICENSE}/LicentieScript.png`,
                slot: "License CLI — full session",
                alt: "AZT License Management Tool session",
                aspect: "aspect-[4/3]",
                mask: "fade-bottom",
              },
            ],
          },
          {
            variant: "single",
            eyebrow: "Showcase · 03",
            heading: "The repository, in stored procedures",
            body: "A slice of the dbo.sp_* surface — same verb set per entity (Activate / Delete / Filter / Get / Insert / Sorteer / Update). Sixty-plus procedures in total. Predictable enough to wrap in a thin generated TypeScript client.",
            media: [
              {
                src: `${AZ_VOORRAAD}/Stored%20Procedures.png`,
                slot: "SQL Server stored procedures list — full repository surface",
                alt: "Stored procedures list — full repository surface",
                aspect: "aspect-[4/5]",
                mask: "fade-bottom",
              },
            ],
          },
          {
            variant: "stack",
            eyebrow: "Showcase · 04",
            heading: "From FileMaker to SQL, in stages",
            body: "The migration pipeline left to right: a Python normaliser produces migratie_output.xlsx; a second script reads that file and emits idempotent INSERTs targeting the new schema; a third generates scoped UPDATEs on the historical bereidings-logboek. Every script runs inside a single transaction.",
            media: [
              {
                src: `${AZ_VOORRAAD}/2migratieScript.png`,
                slot: "Python migration script — normalisation step",
                alt: "Python migration script source",
                aspect: "aspect-[16/10]",
                mask: "fade-bottom",
              },
              {
                src: `${AZ_VOORRAAD}/7InsertPreparations.png`,
                slot: "Auto-generated SQL — idempotent INSERTs for Preparations",
                alt: "Generated SQL insert script for Preparations",
                aspect: "aspect-[4/3]",
                mask: "fade-bottom",
                blurZones: [
                  { x: 0, y: 55, w: 100, h: 45, intensity: "soft" },
                ],
              },
              {
                src: `${AZ_VOORRAAD}/13UpdateAantalBatches.png`,
                slot: "Auto-generated SQL — scoped UPDATEs on bereidings_logboek",
                alt: "Generated SQL update script",
                aspect: "aspect-[4/3]",
                mask: "fade-bottom",
                blurZones: [
                  { x: 0, y: 55, w: 100, h: 45, intensity: "soft" },
                ],
              },
            ],
          },
          {
            variant: "video",
            eyebrow: "Showcase · 05",
            heading: "Endpoint installer, end-to-end",
            body: "Short recording of the endpoint installer tool walking through its provisioning steps. Same baseline runs every time, with clear progress feedback so the operator can see what changed and what didn't.",
            video: {
              src: AZ_VIDEO_INSTALLER,
              alt: "Endpoint installer tool — looped capture",
              caption: "installer · autoplay · muted · looping",
            },
          },
        ],

        /* ── 7. Results ────────────────────────────────────────── */
        results: {
          paragraphs: [
            "The pharmacy moved off FileMaker without losing a single historical record. Migration runs are reproducible — running the pipeline twice against the same target is a no-op, which made staging-to-production switches uneventful.",
            "Day-to-day, the bereidings-logboek is now the single source of truth across roles. Filters and sorts that used to require an Excel export run in the UI; preparations are recorded against the same teller / lot numbers that the audit trail uses.",
            "The supporting tools — licence CLI, endpoint installer, service desk dashboard — absorbed the manual work that used to live in a tribal-knowledge runbook. A new endpoint is now a typed command, not a click-path.",
          ],
          metrics: [
            {
              label: "Stored procedures",
              value: "60+",
              detail:
                "Activate · Delete · Filter · Get · Insert · Sorteer · Update per entity",
            },
            {
              label: "Migration tabs",
              value: "6",
              detail:
                "Controle · Producten · Methodes · Oplosmiddelen · Preparations · DoseVolume",
            },
            {
              label: "License groups managed",
              value: "16",
              detail:
                "AG_* and MG_* Microsoft 365 groups bound to computer objects in AD",
            },
          ],
        },

        /* ── 8. Closing ────────────────────────────────────────── */
        closing: [
          "This is internal software. It will never have a marketing site, a launch tweet or a public roadmap. Its measure is whether the pharmacy team notices it less over time — and that's the bar it's held to.",
          "The patterns underneath — repository-style stored procedures, idempotent migrations, audit-first data model — are general enough that the same scaffold has carried into the surrounding tools (service desk dashboard, endpoint installer, licence CLI). The case study above documents what's visible; the rest stays internal where it belongs.",
        ],

        /* ── Internal projects (tab navigator) ────────────────── */
        internalProjects: [
          {
            id: "voorraadbeheer",
            index: "01",
            name: "Voorraadbeheer",
            tagline:
              "Pharmacy compounding logbook — preparation records, stamdata and inventory in a single auditable system.",
            status: "Live · Internal",
            context: [
              "The daily-driver app for the AZ Turnhout pharmacy compounding team. Every batch of patient-specific oncology mixtures is recorded here — teller, lot number, preparation date, product, method, solvent — and the same data feeds the audit trail and the inventory view.",
              "Replaces a long-lived FileMaker setup that had grown to the edge of its lifespan. Same vocabulary as the paper rhythm the team already uses, so the switch felt like a tooling upgrade, not a process change.",
            ],
            built: [
              "Next.js front-end on the bereidings-logboek with filter / sort across apotheker, bereider, datum, jaar, lotnummer, maand and product. SQL Server back-end exposed through a repository layer of stored procedures (Activate / Delete / Filter / Get / Insert / Sorteer / Update per entity).",
              "Python migration pipeline that lifted years of historical records from the FileMaker export through a normalised xlsx staging file into idempotent SQL — every INSERT guarded by IF NOT EXISTS so the pipeline can re-run against the same target without producing duplicates.",
            ],
            stack: [
              "Next.js",
              "TypeScript",
              "SQL Server",
              "Stored procedures",
              "Python",
              "pandas",
            ],
            results: [
              "Compounding records, stamdata and inventory now live in a single auditable system. Filters and sorts that previously required an Excel export run inside the UI.",
              "Migration runs are reproducible; staging-to-production switches are no-ops when nothing has changed.",
            ],
            mediaDir: AZ_PROJECT_VOORRAAD,
          },
          {
            id: "installer-tool",
            index: "02",
            name: "Installer tool",
            tagline:
              "Guided endpoint installer for the standard AZT software baseline — same workflow, same result, every machine.",
            status: "Live · Internal",
            context: [
              "New endpoints used to be provisioned through a tribal-knowledge runbook of PowerShell steps that were easy to skip or run out of order. The result varied depending on who ran them.",
              "The brief was to wrap the existing baseline into a guided installer with clear progress feedback, so any IT staff member could run it the same way.",
            ],
            built: [
              "Walk-through UI that wraps the existing PowerShell deployment steps. Each step shows its current state — pending, running, done, failed — and the tool refuses to advance until the previous step has completed cleanly.",
              "Operations are logged with timestamps; failed steps surface their underlying error in-line instead of forcing the operator to dig through a console.",
            ],
            stack: ["PowerShell", "WPF / XAML", "AD"],
            results: [
              "A new endpoint is now a guided 10-minute flow instead of a tribal-knowledge runbook.",
              "Replaying the install on an existing machine is safe — completed steps short-circuit instead of re-running destructively.",
            ],
            mediaDir: AZ_PROJECT_INSTALLER,
          },
          {
            id: "licentie-tool",
            index: "03",
            name: "LicentieTool",
            tagline:
              "AD-bound Microsoft 365 licence management — pick a computer, see its current group memberships, mutate with a preview step.",
            status: "Live · Internal",
            context: [
              "Microsoft 365 licences at AZ Turnhout are bound to computer objects in AD via AG_* / MG_* security groups. Manual maintenance through native admin tools was slow and error-prone — easy to add the wrong group or forget to remove an old one.",
              "The brief was a small interactive PowerShell tool that turned the click-path into a typed command with a preview-and-confirm safety net.",
            ],
            built: [
              "PowerShell CLI that resolves the current computer's AD object, lists the available AG_* / MG_* groups, shows current memberships, and asks for which to add or remove. A preview step lists the pending mutations before anything lands in AD.",
              "All operations are logged with timestamps. Sensitive identifiers (user, computer DN, group container) are redacted at source in the recordings.",
            ],
            stack: ["PowerShell", "Active Directory", "Microsoft 365"],
            results: [
              "Licence-assignment work that used to live in a runbook is now a typed command. Easy to teach, easy to audit.",
              "The preview-and-confirm flow caught two cases of wrong-group selection during testing alone — the safety net pays for itself.",
            ],
            mediaDir: AZ_PROJECT_LICENSE,
          },
          {
            id: "servicedesk-dashboard",
            index: "04",
            name: "Service Desk Dashboard",
            tagline:
              "Internal IT dashboard — current incident queue, recent resolutions, system health, built on the same component vocabulary as the rest of the suite.",
            status: "Live · Internal",
            context: [
              "Support staff at AZ Turnhout were jumping between several admin consoles to see what was happening. None of them rolled up into a single view, so 'how busy are we right now?' was a question without a quick answer.",
              "The dashboard pulls the moving parts onto one screen — current queue, recent activity, the metrics that matter for daily standups.",
            ],
            built: [
              "Next.js dashboard that aggregates the queue and recent activity from the underlying support system. Same typography, spacing and accent vocabulary as the pharmacy suite, so anyone who already knows the bereidings-logboek can read it at a glance.",
              "Designed for a wall-mounted display as much as a laptop — large numerals, hairline dividers, no chrome.",
            ],
            stack: ["Next.js", "TypeScript", "Tailwind", "REST APIs"],
            results: [
              "One pane of glass for the support team's day-to-day overview.",
              "Cut context-switching between admin consoles for the most common 'what's happening right now' questions.",
            ],
            mediaDir: AZ_PROJECT_SERVICEDESK,
          },
        ],
      },
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

export const projects = applyProjectMedia(baseProjects);
export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
