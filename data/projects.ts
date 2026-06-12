import type { Project } from "@/lib/types";
import { applyProjectMedia } from "@/lib/apply-project-media";
import { loc, locArr, resolveLocalizedDeep, type Locale } from "@/lib/i18n";

/**
 * Single source of truth for portfolio projects.
 * Featured projects render in <FeaturedProjects /> and on /projects.
 * Each project has a case study page at /projects/[slug].
 *
 * Projects with `caseStudy.longForm` get the editorial long-form layout;
 * everything else falls back to the basic case-study renderer.
 *
 * Static assets live under `public/projects/<slug>/` (public URL `/projects/...`).
 * Card + basic gallery media for Jansen are merged from
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
    slug: "aria",
    title: "Aria — Adaptive Residential Intelligence Architecture",
    tagline:
      "An adaptive AI assistant architecture for voice interaction, local commands and a growing home-automation ecosystem.",
    description:
      "Aria — short for Adaptive Residential Intelligence Architecture — is a personal AI runtime built around voice-first interaction, modular skills and structured tool use. Not a chatbot, but a small ecosystem designed to grow into a residential intelligence layer over time.",
    role: "Creator",
    year: 2025,
    stack: [
      "TypeScript",
      "Python",
      "OpenAI API",
      "Speech-to-text",
      "Text-to-speech",
      "Tool use",
    ],
    highlights: [
      "Voice-first interaction with structured tool use for real local commands",
      "Modular skill architecture — capabilities plug in without touching the runtime",
      "Designed to grow into a residential / home-automation intelligence layer",
    ],
    status: "in-progress",
    featured: true,
    accent: "blue",
    links: {},
    // Aria video lives under /project_afbeeldingen/Aria/. Filename keeps
    // its on-disk name (still contains "Jarvis" — pre-rename); the
    // mediaOverrides caption below scrubs it for any visible label.
    media: {
      type: "video",
      src: "/project_afbeeldingen/Aria/Demo%20Jarvis%20Nederlands.mp4",
      alt: "Aria — voice interaction demo",
    },
    caseStudy: {
      overview:
        "Aria — Adaptive Residential Intelligence Architecture — is a personal AI assistant project being built into a residential intelligence layer. The focus is not a chat window, but a runtime that handles voice, tool execution and a growing set of skill modules.",
      problem:
        "Mainstream assistants stop at conversation. Home-automation lives behind a dozen vendor apps. Voice interfaces are only useful when they actually do something — execute a local command, open an app, trigger a workflow.",
      solution:
        "A modular runtime with three clean seams: voice I/O (speech-to-text → intent, then text-to-speech back), a tool/router layer that maps intents to real actions, and skill modules that own their own domain. Each layer can evolve independently without breaking the others.",
      result:
        "An evolving personal AI ecosystem. The current build handles voice interaction, structured tool use, and a starter set of local commands. Direction matters more than feature count — this is an architecture to grow into, not a launched product.",

      /* ──────────────────────────────────────────────────────────
         Long-form editorial layout — split hero with the demo video
         ────────────────────────────────────────────────────────── */
      longForm: {
        contextTags: [
          "Adaptive Residential Intelligence Architecture",
          "Voice-first",
          "Personal AI",
          "In progress",
        ],

        /* Split hero — title text left, demo video right (Linear/Vercel
           style). The same video re-appears as the showcase primary —
           hero-filter is skipped under heroLayout: "split". */
        heroLayout: "split",

        heroMedia: {
          kind: "video",
          src: "/project_afbeeldingen/Aria/Demo%20Jarvis%20Nederlands.mp4",
          alt: "Aria — voice interaction demo",
          caption: "Aria · voice interaction demo (Dutch capture)",
        },

        /* Auto-discovery from the Aria folder. Currently just one video;
           drop more captures here to expand the showcase. */
        mediaDir: "/project_afbeeldingen/Aria",

        /* The on-disk filename still has "Jarvis" in it (pre-rename).
           This override scrubs the visible caption to Aria copy without
           needing to rename the file on disk. */
        mediaOverrides: {
          "Demo Jarvis Nederlands.mp4": {
            caption: "Aria · voice interaction demo (Dutch capture)",
            alt: "Aria — voice interaction demo",
          },
        },

        sectionLabels: {
          problem: { eyebrow: "Problem" },
          tooling: {
            eyebrow: "Architecture",
            heading: "Three clean seams",
            description:
              "Aria is small on purpose. The architecture is a runtime, a tool/router layer and a skill plug-in surface — each owning one concern, each replaceable without breaking the others.",
          },
          showcase: {
            eyebrow: "Demo",
            heading: "What it looks like in use",
            description:
              "A Dutch voice capture from a current build. Wake word → speech-to-text → intent → tool execution → spoken response, end-to-end.",
          },
          engineering: {
            eyebrow: "What it can do",
            heading: "Capabilities, today",
            description:
              "The current shape — not a feature list, a snapshot of what already works in the live runtime. Everything else is in progress.",
          },
          results: {
            eyebrow: "Learnings",
            heading: "What this is teaching me",
          },
          closing: { eyebrow: "Note" },
        },

        /* ── 2. Context ────────────────────────────────────────── */
        context: [
          "Aria is a personal AI assistant project I started because the off-the-shelf ones stop being interesting the moment you want them to actually do something. A chat window is fine for ideation; a residential intelligence layer that can open apps, trigger automations and respond by voice is a different category of product.",
          "The name is also the brief: Adaptive Residential Intelligence Architecture. Adaptive — it grows with the skills I plug in. Residential — the long arc is home automation, not enterprise productivity. Intelligence Architecture — a runtime, not a single app, with room for new capabilities without rewriting the core.",
          "This is an in-progress project. There's no launch date, no product page, no marketing. I'm building it because the architecture itself is the interesting bit — and because I want a real personal assistant, not another chat tab.",
        ],

        /* ── 3. Problem detail ─────────────────────────────────── */
        problemDetail: {
          paragraphs: [
            "Mainstream AI assistants are conversation-shaped. They can describe what to do; they can't do it. For most queries that's enough. For the ones where you want a window opened, an automation triggered, a service called — they hit a wall.",
            "Home automation is the inverse problem. Each device or platform comes with its own app, its own remote, its own routine syntax. Lights here, climate there, media in a third place. A unified voice layer over the top is the obvious idea — every assistant project from the past decade has tried it, and most have either gotten too generic to be useful or too narrow to be worth the install.",
            "Aria's bet is that a small, opinionated architecture beats a sprawling feature surface. A few clean seams (voice in, tool out, skills plugged in), each replaceable, each safe to extend. Less product, more runtime.",
          ],
          media: [],
        },

        /* ── 4. Architecture (Tooling cards) ───────────────────── */
        tooling: [
          {
            eyebrow: "01 · Central runtime",
            title: "The orchestration layer",
            description:
              "A thin runtime that coordinates voice input, intent resolution, tool calls and spoken response. No domain logic lives here — only the choreography between layers. The whole point is that the runtime stays boring while the skills get interesting.",
          },
          {
            eyebrow: "02 · Skill modules",
            title: "Capabilities as plug-ins",
            description:
              "Each capability is a self-contained skill module: a small contract for what intents it claims, what tools it exposes, and how it responds. New skills land as new modules — the runtime doesn't change. Bad skills can be unplugged without consequence.",
          },
          {
            eyebrow: "03 · Tool / router layer",
            title: "From intent to real action",
            description:
              "The mediator between language and machines. Voice intents resolve to structured tool calls — open an app, query a service, trigger an automation — with strict argument shapes and explicit allow-lists. Tool execution is where assistants stop being toys.",
          },
          {
            eyebrow: "04 · Voice I/O",
            title: "Speech in, speech out",
            description:
              "Speech-to-text on the way in, text-to-speech on the way out, with intent extraction wedged between. The voice loop is the thing that turns a chat assistant into a residential one — the moment a phone or laptop becomes a microphone, the product changes.",
          },
        ],

        /* ── 5. What it can do (Engineering cards, relabelled) ── */
        engineering: [
          {
            index: "01",
            title: "Voice-driven interaction",
            body: "Full voice loop end-to-end: wake → capture → transcribe → understand → respond. The latency is good enough to feel like a conversation rather than a request-response cycle.",
          },
          {
            index: "02",
            title: "Structured tool calls",
            body: "Intents resolve to typed tool calls with explicit argument shapes. Tools are registered with allow-lists so the runtime can't be cajoled into running anything that isn't pre-declared.",
          },
          {
            index: "03",
            title: "Local command execution",
            body: "Open apps, trigger scripts, run small workflows on the host machine. The starter set is pragmatic — the kind of things a power-user keyboard shortcut already does, but exposed through voice.",
          },
          {
            index: "04",
            title: "Skill plug-in surface",
            body: "Adding a new capability is a single module with a small contract. No runtime changes, no rebuild. Removing a skill is just as cheap — modular boundaries pay off most when you change your mind.",
          },
          {
            index: "05",
            title: "Future: residential integrations",
            body: "Home-automation hooks are the direction of travel — lights, climate, media, presence. Not yet shipped; the architecture is shaped so they slot in as additional skill modules without touching anything that already works.",
          },
        ],

        /* ── 6. Visual showcase via mediaDir ────────────────────── */
        showcase: [],

        /* ── 7. Learnings (Results) ─────────────────────────────── */
        results: {
          paragraphs: [
            "Architecture over features. Every time I prototyped a single feature first, I ended up redesigning the runtime around it later. Starting from a runtime — even a small one — saved that loop.",
            "Modularity is mostly about taste. Choosing where the seams go is more design work than implementation work. The skill / tool / runtime split feels right today; ask me in six months whether it still does.",
            "Voice UX is its own discipline. Latency, error recovery, the way a slightly wrong intent still gets a useful response — none of these are LLM problems. They're product problems that only show up the moment a microphone is in the loop.",
            "Safe boundaries beat raw capability. The interesting question on a runtime that can execute local commands isn't 'what else can it do', it's 'what is it not allowed to do, and how do I know'.",
          ],
        },

        /* ── 8. Closing ────────────────────────────────────────── */
        closing: [
          "Aria is in progress and probably always will be in some form. It's a personal AI ecosystem, not a launched product — the direction is what matters more than the version number.",
          "The premise is that residential intelligence is a runtime problem more than a model problem. The model is the easy part now. Voice loops, tool safety, skill boundaries and the way a home actually wants to be talked to — that's the part worth building.",
        ],
      },
    },
  },
  {
    slug: "jansen-car-detailing",
    title: "Jansen Car Detailing",
    tagline: "A premium marketing site for a local detailing studio.",
    description:
      "A modern, conversion-focused website for Jansen Car Detailing — clear service presentation, polished mobile experience, and content that's easy for the owner to maintain. Built to feel as premium as the work.",
    role: "Developer & Designer",
    year: 2025,
    stack: ["Next.js", "TypeScript", "Tailwind"],
    highlights: [
      "Premium dark editorial design tuned to the automotive detailing audience",
      "Mobile-first — bookings and quote requests fit a single thumb path",
      "Structured service catalogue the owner can extend without developer help",
    ],
    status: "live",
    featured: true,
    accent: "cyan",
    links: {
      // NOTE: confirm the real production URL with the client; this is the
      // current best guess — easy to swap when you have the canonical domain.
      live: "https://jansencardetailing.be",
    },
    caseStudy: {
      overview:
        "Jansen Car Detailing is a Belgian detailing studio. The brief was a marketing site that feels as premium as the work — clear service presentation, fast mobile experience, and content the owner can maintain.",
      problem:
        "An ageing site that didn't reflect the quality of the actual detailing work. Conversion was low; the owner couldn't update copy without developer help.",
      solution:
        "A fresh marketing site with a structured service catalogue, polished mobile experience, and a content layer the owner controls directly. Built with Next.js and Tailwind for fast loads on mobile networks.",
      result:
        "Visibly more bookings, more direct contact through the site, and a maintenance workflow that no longer requires developer involvement for ordinary content updates.",

      /* ──────────────────────────────────────────────────────────
         Long-form editorial layout — premium frontend / client showcase
         ────────────────────────────────────────────────────────── */
      longForm: {
        contextTags: ["Client work", "Marketing site", "Automotive", "Belgium"],

        heroMedia: {
          kind: "video",
          src: "/project_afbeeldingen/jansencardetailing/video%20website%20jansencardetailing.mp4",
          alt: "Jansen Car Detailing — homepage loop",
          caption: "jansencardetailing · homepage · live site",
        },

        /* Auto-discovery folder for the visual showcase. Drop captures into
           public/project_afbeeldingen/jansencardetailing/ and they appear curated. */
        mediaDir: "/project_afbeeldingen/jansencardetailing",

        sectionLabels: {
          problem: { eyebrow: "Context" },
          tooling: {
            eyebrow: "Design direction",
            heading: "An automotive luxury feel, kept editorial",
            description:
              "The pillars that shaped every decision — from typography down to how a single chrome trim photo crops on mobile.",
          },
          engineering: {
            eyebrow: "Performance",
            heading: "Fast, restrained, mobile-first",
            description:
              "Marketing sites live or die on the first three seconds. The technical decisions all point the same direction: load fast, render right, never get in the way of the work.",
          },
          showcase: {
            eyebrow: "Visual showcase",
            heading: "The site, on real screens",
            description:
              "Captures from the live build across desktop and mobile. Click any image to open it fullscreen.",
          },
          results: {
            eyebrow: "Outcome",
            heading: "What changed after launch",
          },
          closing: { eyebrow: "Note" },
        },

        /* ── 2. Context ────────────────────────────────────────── */
        context: [
          "Jansen Car Detailing is a small, owner-led detailing studio in Belgium. The work itself is meticulous — multi-stage paint corrections, ceramic coatings, full interior reconditioning — but the previous web presence didn't reflect any of that. Prospective clients arrived from search or word-of-mouth and bounced off a site that looked thrown together.",
          "The brief from the owner was straightforward: a site that looks as expensive as the work, that he can update himself, and that converts curious visitors into booked appointments. No fluff. No agency vibes.",
        ],

        /* ── 3. Challenge ──────────────────────────────────────── */
        problemDetail: {
          paragraphs: [
            "Three constraints framed the build. First, the site had to feel premium — the kind of dark editorial palette that automotive enthusiasts already associate with quality, without tipping into nightclub territory. Second, mobile had to come first: more than seven in ten visitors land on a phone, and the booking path has to fit a single thumb. Third, the owner needed to be able to add new services, update prices, swap hero photography — without ever opening a code editor.",
            "Beyond that: every screen had to load fast on a 4G connection, every service had to be discoverable in two taps, and the visual language had to feel like the same hand designed the whole thing — typography, spacing, photography crop, button radius — even on the long detail pages.",
          ],
          media: [],
        },

        /* ── 4. Design direction — re-purposed Tooling cards ───── */
        tooling: [
          {
            eyebrow: "01 · Palette",
            title: "Deep dark editorial",
            description:
              "Near-black backgrounds let the actual detailing photography do the heavy lifting. A single accent — chrome blue — used surgically for hover states and call-to-action moments, never as decoration.",
          },
          {
            eyebrow: "02 · Typography",
            title: "Serif headlines, mono labels",
            description:
              "Display serif for the editorial headings, paired with mono caps for the small structural labels (service tags, price tiers, time estimates). The result reads more like a print magazine than a generic service site.",
          },
          {
            eyebrow: "03 · Photography",
            title: "Single hero, generous crops",
            description:
              "One full-bleed hero photo per landing area. Tight crops on the detail pages — a single chrome reflection, a clay-bar pass, a polishing pad mid-rotation — instead of an everything-shot. The work shows up bigger that way.",
          },
          {
            eyebrow: "04 · Motion",
            title: "Restrained, never decorative",
            description:
              "Fade and rise on scroll for cards, gentle parallax on the hero image, hover states that lift cards a couple of pixels. No bouncy springs, no flashy reveals — motion as a focus tool, not a personality.",
          },
        ],

        /* ── 5. Performance & engineering cards ───────────────── */
        engineering: [
          {
            index: "01",
            title: "Mobile-first layout",
            body: "Every section was designed at 375 px first and scaled up. Booking CTAs sit inside the thumb-reach zone on phones; the desktop layout is the responsive expansion, not the starting point.",
          },
          {
            index: "02",
            title: "Next.js Image everywhere",
            body: "Hero, gallery and service detail photos all route through next/image with explicit `sizes` hints. Format negotiation (AVIF / WebP) and responsive srcsets keep the heaviest pages comfortably under 1 MB on first paint.",
          },
          {
            index: "03",
            title: "Static where it can be",
            body: "Service pages render statically at build time. The site has no database in the request path — the only runtime calls are the contact form submit and a small analytics ping. First contentful paint stays sub-second on 4G.",
          },
          {
            index: "04",
            title: "Structured service catalogue",
            body: "Every service (washes, paint correction, ceramic coatings, interior detail) lives as a TypeScript record with name, description, price tier, duration and gallery. Adding a service is one entry; the listing pages, detail pages and homepage cards all derive from the same source.",
          },
          {
            index: "05",
            title: "Owner-editable content",
            body: "Long-form copy and pricing live in a small content layer the owner edits directly through a guided UI. No deploy step, no developer handover for an evening edit before a phone call with a client.",
          },
          {
            index: "06",
            title: "Accessibility baseline",
            body: "Real focus rings, alt text on every photo, proper heading hierarchy, contrast ratios checked at AA. None of this is glamorous — it's just the table-stakes a credible 2025 site is built on.",
          },
        ],

        /* ── 6. Visual showcase (auto-discovered from mediaDir) ── */
        showcase: [],

        /* ── 7. Results ────────────────────────────────────────── */
        results: {
          paragraphs: [
            "Post-launch the owner saw a clear bump in direct contact through the site — typed quote requests, phone calls referencing specific service pages. Conversations now start with the work the visitor already understood from the site, not a blank slate.",
            "The maintenance workflow that used to require a developer round-trip for every price tweak is gone. Adding a service, updating a hero photo, posting a before/after — all owner-controlled. The site keeps shipping without me touching it.",
            "Mobile UX held up: bookings from phones run smoothly through the contact flow, and the homepage video plays inline without forcing a tap.",
          ],
        },

        /* ── 8. Closing ────────────────────────────────────────── */
        closing: [
          "Premium-feeling client sites aren't built from clever animation libraries. They're built from typography, photography crop, restrained motion and a content model the owner can live with for years. Jansen was a chance to prove that out on a real client brief with real revenue downstream.",
          "The repo stays small and maintainable on purpose — Next.js, TypeScript, Tailwind, one small content layer. Easy to revisit, easy to extend.",
        ],
      },
    },
  },
  {
    slug: "climbing-training-tool",
    title: "Climbing Training Plan Generator",
    tagline:
      "A web tool that turns a six-question form into a personalised indoor climbing plan.",
    description:
      "A small web tool I built for my own climbing — six inputs in (level, current grade, target grade, training days, goal, optional injuries), one structured weekly plan out. Practical sport tech, not a SaaS, not a metric chart.",
    role: "Creator",
    year: 2025,
    stack: ["React", "TypeScript", "Tailwind", "Vercel"],
    highlights: [
      "Form-driven plan generation — six inputs in, structured weekly routine out",
      "Domain-aware logic — grade progression mapped to realistic training load",
      "Deployed on Vercel with a clean, minimal product surface",
    ],
    status: "live",
    featured: true,
    accent: "violet",
    links: {
      live: "https://climbing-training-tool.vercel.app/",
    },
    // Explicit card media so /projects, home and the about shelf all render
    // the form screenshot directly. The same folder is also used as the
    // case-study mediaDir for auto-discovery of future captures.
    media: {
      type: "image",
      src: "/project_afbeeldingen/climbing-training-tool/training_tool.png",
      alt: "Climbing Training Plan Generator — form view",
    },
    caseStudy: {
      overview:
        "A web tool that takes a short form — climbing level, current grade, target grade, weekly availability, goal, optional injuries — and returns a structured indoor climbing plan. Built as a personal training utility, deployed on Vercel.",
      problem:
        "Generic fitness apps don't speak climbing. Climbing-specific resources are scattered across forums, coach articles and PDFs. None of them ask the right inputs and return something you can act on this week.",
      solution:
        "A single-page web form that gathers the inputs that actually matter for indoor climbing — level, grades, schedule, goal, limitations — and outputs a structured plan tuned to the climber's current state instead of a generic template.",
      result:
        "I use it for my own training cycles. The form-to-plan loop is fast enough to re-run when a goal changes mid-cycle; the output is structured enough to follow without re-reading every session.",

      /* ──────────────────────────────────────────────────────────
         Long-form editorial layout — compact personal sport-tech tool
         Single-folder showcase via mediaDir auto-discovery.
         ────────────────────────────────────────────────────────── */
      longForm: {
        contextTags: ["Sport tech", "Climbing", "Personal tool", "Web app"],

        /* Split hero — title text left, product mockup right (SaaS/Linear
           style). Collapses to a vertical stack on mobile. The standalone
           hero media section is auto-omitted under split. */
        heroLayout: "split",

        /* Hero shows the form UI — the entry point of the tool. The renderer
           auto-filters this file from the showcase below to avoid showing
           the same image twice. */
        heroMedia: {
          kind: "image",
          ref: {
            src: "/project_afbeeldingen/climbing-training-tool/training_tool.png",
            slot: "Climbing Training Plan Generator — form",
            alt: "Climbing Training Plan Generator form UI on the live site",
            caption: "climbing-training-tool · form view · live site",
            // The screenshot is ~1274x1130 (near-square landscape).
            // aspect-[1/1] matches its natural shape closely, so the
            // form fills the card edge-to-edge with only ~25px letterbox
            // top + bottom (down from ~80px under 4/5). Reads as a
            // compact product card while staying centred and "portrait-
            // leaning" in the layout.
            frame: "mockup",
            aspect: "aspect-[1/1]",
            fit: "contain",
          },
        },

        /* Auto-discovery folder. Drop further captures into
           public/project_afbeeldingen/climbing-training-tool/ and they
           appear in the showcase automatically. */
        mediaDir: "/project_afbeeldingen/climbing-training-tool",

        /* Explicit narrative order — form first (filtered out as hero),
           then the two generated-plan screenshots in the showcase. */
        mediaOrder: [
          "training_tool.png",
          "training_plan1.png",
          "training_plan2.png",
        ],

        /* Showcase-context overrides. Note: training_tool.png ALSO appears
           in the hero via heroMedia, but under heroLayout:"split" the
           renderer does NOT auto-filter it from the showcase — the same
           screenshot legitimately re-appears here as the first beat of
           the user-flow sequence (form → plan output 1 → plan output 2).
           All three get frame:"mockup" so the showcase stays in uniform
           all-mockup grid mode (no full-width primary tile). aspect-[3/4]
           keeps the tiles visually consistent in the 2-col grid; tool
           letterboxes lightly (near-square content in a tall frame) but
           the form is still recognisable, and the lightbox shows the
           full sharp image on click. */
        mediaOverrides: {
          "training_tool.png": {
            frame: "mockup",
            fit: "contain",
            // Form screenshot is near-square (1274x1130, aspect ~1.127),
            // not a long text capture. aspect-[1/1] matches its natural
            // shape: only ~25px letterbox top/bottom, no long grey frame.
            // Plans below stay aspect-[3/4] — their content is tall text.
            aspect: "aspect-[1/1]",
            caption: "form input · the entry point",
          },
          "training_plan1.png": {
            frame: "mockup",
            fit: "contain",
            aspect: "aspect-[3/4]",
            caption: "generated plan · output (1 of 2)",
          },
          "training_plan2.png": {
            frame: "mockup",
            fit: "contain",
            aspect: "aspect-[3/4]",
            caption: "generated plan · output (2 of 2)",
          },
        },

        sectionLabels: {
          problem: { eyebrow: "Problem" },
          tooling: {
            eyebrow: "What it does",
            heading: "Six inputs, one structured plan",
            description:
              "The form asks only what a climbing plan actually depends on. Nothing speculative, nothing decorative. Each input maps onto a concrete dimension of the generated routine.",
          },
          showcase: {
            eyebrow: "UI / form flow",
            heading: "The form, on the live site",
            description:
              "A single dark form, vertical scroll, one primary action. Click the image to open it fullscreen.",
          },
          engineering: {
            eyebrow: "Product logic",
            heading: "How the plan gets shaped",
            description:
              "The generation is not a coach-in-a-bottle. It is a small set of climbing-domain heuristics that turn structured inputs into a sensible weekly skeleton — leaving the actual session quality to the climber.",
          },
          results: {
            eyebrow: "Learnings",
            heading: "What this taught me",
          },
          closing: { eyebrow: "Note" },
        },

        /* ── 2. Context ────────────────────────────────────────── */
        context: [
          "I climb indoors regularly — boulder and route, mixed disciplines, with the kind of mid-grade plateau that most amateur climbers eventually meet. Training in climbing is its own discipline: it's not just 'climb more'. Volume, recovery, hangboard exposure, projecting density and antagonist work all interact, and what works at 6B doesn't work at 7A.",
          "I kept reading the same advice spread across forums, coach blogs and PDFs, then trying to translate it into what to do this Tuesday. After enough rounds of that, building a tiny tool that just asked the right questions and produced a starting plan felt like the obvious move.",
          "The audience is single-user: me, and any climber who'd recognise the inputs as the ones that actually matter for their week.",
        ],

        /* ── 3. Problem detail ─────────────────────────────────── */
        problemDetail: {
          paragraphs: [
            "Mainstream fitness apps are built around running, lifting and step counts. They don't ask about grades, projecting cycles, or finger-recovery windows. Even when they let you log climbing as a freeform workout, they can't reason about the load.",
            "Climbing-specific guidance exists, but it's scattered — forum threads, training-blog posts, coach interviews, the occasional structured PDF. Each piece is useful on its own; none of them ask for your inputs and hand you a plan you can run with.",
            "The gap was small but real: a focused tool that takes the half-dozen variables a coach would ask about and returns a structured starting point. Not a replacement for a real coach, just the kind of scaffolding that turns intention into a schedule.",
          ],
          media: [],
        },

        /* ── 4. What it does (Tooling cards, relabelled) ───────── */
        tooling: [
          {
            eyebrow: "01 · Level + grade",
            title: "Where the climber is right now",
            description:
              "Climbing level (Beginner → Advanced) plus current grade and target grade. The grade pair anchors how aggressive the progression can be — chasing 7A from 5+ is not the same plan as 6C+ from 6B+.",
          },
          {
            eyebrow: "02 · Schedule",
            title: "How many sessions per week",
            description:
              "Training days per week sets the weekly volume budget. Two sessions and four sessions get fundamentally different plans — not just 'more of the same', but a different distribution of work, technique and recovery.",
          },
          {
            eyebrow: "03 · Goal",
            title: "What the climber is training for",
            description:
              "General improvement, endurance, power, or project send. The goal reshapes the emphasis — power blocks for project send, capacity work for endurance, balanced skill work for general improvement.",
          },
          {
            eyebrow: "04 · Injuries / limitations",
            title: "What the plan has to respect",
            description:
              "A free-text field for things like a recovering finger pulley or a sore shoulder. The plan adapts — fewer intense hangs, more antagonist work, modified projecting — instead of pretending the climber is at 100%.",
          },
        ],

        /* ── 5. UI / form flow → MediaShowcase via mediaDir ────── */
        showcase: [],

        /* ── 6. Product logic (Engineering cards, relabelled) ─── */
        engineering: [
          {
            index: "01",
            title: "Grade-aware progression",
            body: "The gap between current and target grade defines the load curve. Big gap means longer plan with skill-build phases; small gap means a denser projecting block. The grade pair is the spine of every other decision.",
          },
          {
            index: "02",
            title: "Volume scaling on session count",
            body: "Two sessions a week is a focused plan with one technique focus and one project session. Four sessions opens room for hangboard, antagonists and a dedicated mileage day. Volume isn't multiplied — it's redistributed.",
          },
          {
            index: "03",
            title: "Recovery as a first-class block",
            body: "Climbing plans break when recovery is implicit. Each generated week includes explicit rest framing — finger-recovery windows, off-day notes — rather than treating rest as the absence of work.",
          },
          {
            index: "04",
            title: "Climbing-domain heuristics",
            body: "The mapping from inputs to outputs is small set of rules pulled from climbing literature, not an LLM call. That keeps it deterministic, fast and honest about what it is — a structured starting point, not a personalised coach.",
          },
          {
            index: "05",
            title: "Stateless, single-page",
            body: "No accounts, no database, no session persistence. The form lives on a single page; the plan is generated client-side and rendered inline. The whole tool is small enough to deploy on Vercel's free tier.",
          },
        ],

        /* ── 7. Learnings (Results, relabelled) ────────────────── */
        results: {
          paragraphs: [
            "The clearest lesson was about input design. The early form had ten questions; the live one has six. Every dropped input forced a sharper rule on what the plan actually depends on. Removing fields turned out to be more product work than adding logic.",
            "Climbing knowledge encoded as rules is more honest than wrapping an LLM around the same prompt. The output is reproducible, the reasoning is inspectable, and when the plan is wrong I can fix the rule instead of re-prompting.",
            "Deploying on Vercel kept the loop short. The tool was usable in production after a single afternoon — which was the whole point. Sport tooling that doesn't ship doesn't get used.",
          ],
        },

        /* ── 8. Closing note ───────────────────────────────────── */
        closing: [
          "This is the kind of tool that wouldn't make sense as a startup. It's small, single-user-shaped, and useful precisely because it doesn't try to be more. Personal sport tech earns its place by being practical first — by the climber actually using the plan it generates the following Tuesday.",
        ],
      },
    },
  },
  {
    slug: "boulder-buddy",
    title: loc(
      "BoulderBuddy — full-stack bouldering platform",
      "BoulderBuddy — full-stack boulderplatform",
    ),
    tagline: loc(
      "A full-stack bouldering platform — Next.js admin + Prisma/PostgreSQL backend + Expo mobile app for climbers.",
      "Een full-stack boulderplatform — Next.js-admin + Prisma/PostgreSQL-backend + Expo-mobiele app voor klimmers.",
    ),
    description: loc(
      "BoulderBuddy is a full-stack platform for indoor bouldering — a Next.js admin/backend and an Expo/React Native mobile app sharing a single Prisma/PostgreSQL schema. Auth + role-based access, gym → wall → sector → boulder content model, session logs and lightweight social (likes + comments), with a demo dataset of real climbing media.",
      "BoulderBuddy is een full-stack platform voor indoor bouldering — een Next.js-admin/backend en een mobiele Expo/React Native-app die één Prisma/PostgreSQL-schema delen. Authenticatie + rolgebaseerde toegang, een gym → muur → sector → boulder-datamodel, sessielogs en lichte sociale functies (likes + reacties), met een demodataset vol echte klimmedia.",
    ),
    role: "Creator",
    year: 2025,
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Expo",
      "React Native",
      "Tailwind",
    ],
    highlights: locArr(
      [
        "Full-stack — Next.js admin/backend + Expo/React Native mobile app sharing one Prisma schema",
        "Domain model: gyms, walls, sectors, boulders, sessions, logs, likes, comments — with role-based access",
        "Demo dataset with real climbing photos and video — production-shaped, not lorem ipsum",
      ],
      [
        "Full-stack — Next.js-admin/backend + mobiele Expo/React Native-app op één gedeeld Prisma-schema",
        "Datamodel: gyms, muren, sectoren, boulders, sessies, logs, likes en reacties — met rolgebaseerde toegang",
        "Demodataset met echte klimfoto's en -video — productie-waardig, geen lorem ipsum",
      ],
    ),
    status: "in-progress",
    featured: true,
    accent: "violet",
    links: {},
    // Project card shows both surfaces side-by-side, uncropped: the wide
    // backend/admin loop (~72%) beside the narrow mobile loop (~28%).
    cardMediaLayout: "split-platforms",
    media: {
      type: "video",
      src: "/project_afbeeldingen/BoulderBuddy/BoulderBuddy%20backend.mp4",
      alt: loc(
        "BoulderBuddy — backend / admin demo",
        "BoulderBuddy — backend-/admin-demo",
      ),
      label: "admin / backend",
    },
    cardMediaSecondary: {
      type: "video",
      src: "/project_afbeeldingen/BoulderBuddy/BoulderBuddy%20mobile.mp4",
      alt: loc(
        "BoulderBuddy — mobile app demo",
        "BoulderBuddy — demo mobiele app",
      ),
      label: "mobile app",
    },
    caseStudy: {
      overview: loc(
        "BoulderBuddy is an in-progress full-stack platform for indoor bouldering. A Next.js admin and Expo mobile client share a single PostgreSQL/Prisma schema — gyms, walls, sectors, boulders, sessions, logs, likes and comments — with role-based access and a demo dataset of real climbing media.",
        "BoulderBuddy is een full-stack platform voor indoor bouldering dat nog volop in ontwikkeling is. Een Next.js-admin en een mobiele Expo-client delen één PostgreSQL/Prisma-schema — gyms, muren, sectoren, boulders, sessies, logs, likes en reacties — met rolgebaseerde toegang en een demodataset vol echte klimmedia.",
      ),
      problem: loc(
        "Existing climbing apps split badly between consumer-facing trackers and gym-admin tools that look like a forgotten spreadsheet. Climbers want a clean mobile experience; gyms want a real CMS for walls, sectors and routes; both need the same underlying content to stay in sync.",
        "Bestaande klim-apps vallen slecht uiteen: aan de ene kant trackers voor klimmers, aan de andere kant gym-admintools die op een vergeten spreadsheet lijken. Klimmers willen een strakke mobiele ervaring; gyms willen een echt CMS voor muren, sectoren en routes; allebei hebben ze dezelfde onderliggende content nodig die synchroon blijft.",
      ),
      solution: loc(
        "One Prisma schema, two front-ends. The Next.js admin is the operator surface — manage gyms, walls, sectors, boulders, accounts, roles, demo data. The Expo mobile app is the climber surface — browse, log sessions, react to other climbers' send notes. Auth + roles gate what each side can do.",
        "Eén Prisma-schema, twee front-ends. De Next.js-admin is de beheerderskant — beheer gyms, muren, sectoren, boulders, accounts, rollen en demodata. De mobiele Expo-app is de klimmerskant — bladeren, sessies loggen, reageren op de sendnotities van andere klimmers. Authenticatie + rollen bepalen wat elke kant mag.",
      ),
      result: loc(
        "A working demo of both surfaces with a populated dataset. Admin handles real CRUD on the climbing content model; mobile renders that same data with a focused logging flow. The platform is still in progress, but the core architecture earns its keep already.",
        "Een werkende demo van beide kanten met een gevulde dataset. De admin doet echte CRUD op het klim-datamodel; mobiel toont diezelfde data met een gefocuste logflow. Het platform is nog in ontwikkeling, maar de kernarchitectuur bewijst nu al haar waarde.",
      ),

      /* ──────────────────────────────────────────────────────────
         Long-form editorial layout — split hero with the admin demo
         ────────────────────────────────────────────────────────── */
      longForm: {
        contextTags: locArr(
          ["Full-stack", "Climbing", "Mobile + Web", "In progress"],
          ["Full-stack", "Klimmen", "Mobiel + web", "In ontwikkeling"],
        ),

        /* Split hero — title text left, backend/admin demo video right.
           Under heroLayout: "split" the hero-filter is skipped, so the
           backend video legitimately reappears in the platform-split
           showcase below at full size, next to the mobile capture. */
        heroLayout: "split",

        heroMedia: {
          kind: "video",
          src: "/project_afbeeldingen/BoulderBuddy/BoulderBuddy%20backend.mp4",
          alt: loc(
            "BoulderBuddy — backend / admin demo",
            "BoulderBuddy — backend-/admin-demo",
          ),
          caption: loc(
            "BoulderBuddy · admin / backend walk-through",
            "BoulderBuddy · rondleiding admin / backend",
          ),
          // Show the full backend recording in its native aspect — no crop,
          // no baseline zoom — the hero frame hugs the 16/9 video.
          aspect: "aspect-[16/9]",
          fit: "contain",
        },

        /* Auto-discovery folder for the platform-split showcase below. */
        mediaDir: "/project_afbeeldingen/BoulderBuddy",

        /* Explicit narrative order — backend (wide left tile) first,
           mobile (narrow right tile) second. */
        mediaOrder: [
          "BoulderBuddy backend.mp4",
          "BoulderBuddy mobile.mp4",
        ],

        /* Platform-split showcase: two-tile asymmetric grid that puts the
           backend/admin loop next to the mobile loop. Communicates "one
           platform, two surfaces" in a single glance. */
        showcaseLayout: "platform-split",

        /* Per-video overrides: labels rendered above each tile + native
           aspect ratio per surface so the mobile portrait recording isn't
           letterboxed inside a landscape frame. */
        mediaOverrides: {
          "BoulderBuddy backend.mp4": {
            label: "Admin / Backend",
            caption: "admin · web · Next.js",
            alt: loc(
              "BoulderBuddy — backend / admin demo",
              "BoulderBuddy — backend-/admin-demo",
            ),
            aspect: "aspect-[16/9]",
          },
          "BoulderBuddy mobile.mp4": {
            label: "Mobile App",
            caption: "mobile · Expo · React Native",
            alt: loc(
              "BoulderBuddy — mobile app demo",
              "BoulderBuddy — demo mobiele app",
            ),
            aspect: "aspect-[9/16]",
          },
        },

        sectionLabels: {
          problem: { eyebrow: loc("Problem", "Probleem") },
          tooling: {
            eyebrow: loc("Architecture", "Architectuur"),
            heading: loc("One schema, two surfaces", "Eén schema, twee kanten"),
            description: loc(
              "BoulderBuddy is small on purpose. Four layers, each with one clean responsibility, all sharing the same Prisma model so the admin and the mobile client never drift.",
              "BoulderBuddy is bewust klein gehouden. Vier lagen, elk met één heldere verantwoordelijkheid, die allemaal hetzelfde Prisma-model delen zodat de admin en de mobiele client nooit uit elkaar lopen.",
            ),
          },
          showcase: {
            eyebrow: loc("Demo", "Demo"),
            heading: loc(
              "One platform, two interfaces",
              "Eén platform, twee interfaces",
            ),
            description: loc(
              "The admin surface on the left, the mobile climber app on the right — both rendering the same gyms, walls, sectors and boulders from the shared Prisma schema. Each loop preserves its native aspect ratio so neither surface is stretched.",
              "De adminkant links, de mobiele klimmersapp rechts — allebei tonen ze dezelfde gyms, muren, sectoren en boulders uit het gedeelde Prisma-schema. Elke loop behoudt zijn eigen beeldverhouding, zodat geen van beide kanten wordt uitgerekt.",
            ),
          },
          engineering: {
            eyebrow: loc("What it has", "Wat het heeft"),
            heading: loc("Built today", "Wat er nu staat"),
            description: loc(
              "The current shape of the platform — not a wishlist. Auth, the content model, session logs and social are all in the demo dataset; mobile renders the same data the admin curates.",
              "De huidige vorm van het platform — geen verlanglijst. Authenticatie, het datamodel, sessielogs en sociale functies zitten allemaal in de demodataset; mobiel toont dezelfde data die de admin beheert.",
            ),
          },
          results: {
            eyebrow: loc("Learnings", "Lessen"),
            heading: loc("What this taught me", "Wat ik hiervan leerde"),
          },
          closing: { eyebrow: loc("Note", "Noot") },
        },

        /* ── 2. Context ────────────────────────────────────────── */
        context: locArr(
          [
            "BoulderBuddy is a personal full-stack project shaped around how indoor bouldering actually works. Climbers go to a gym, find a wall, pick a sector, try boulders, log sends and likes. Gym staff curate that content — set new routes, retire old ones, tag grades. The split between climber-facing and gym-facing software in this space is usually bad on at least one side; BoulderBuddy is the attempt at building both from the same Prisma schema.",
            "It's a school-and-side project mash-up: started as part of an applied development course, kept going because the architecture got interesting. There's no launch date — the value is in the platform shape, not a version number.",
          ],
          [
            "BoulderBuddy is een persoonlijk full-stack project, gebouwd rond hoe indoor bouldering echt werkt. Klimmers gaan naar een gym, zoeken een muur, kiezen een sector, proberen boulders, loggen sends en likes. Gymmedewerkers beheren die content — zetten nieuwe routes, halen oude weg, taggen graden. De kloof tussen software voor klimmers en software voor gyms is meestal aan minstens één kant slecht; BoulderBuddy is de poging om beide vanuit hetzelfde Prisma-schema te bouwen.",
            "Het is een kruising tussen een school- en een hobbyproject: begonnen binnen een toegepaste ontwikkelcursus, doorgezet omdat de architectuur interessant werd. Er is geen releasedatum — de waarde zit in de vorm van het platform, niet in een versienummer.",
          ],
        ),

        /* ── 3. Problem detail ─────────────────────────────────── */
        problemDetail: {
          paragraphs: locArr(
            [
              "Consumer climbing apps tend to ignore the operator side: they assume gym content magically appears. Gym-admin tools tend to ignore the climber side: they're spreadsheets with a login. Neither understands that the same gym → wall → sector → boulder hierarchy lives on both ends, and that it has to stay in lockstep.",
              "The Prisma model is the bridge. One schema, generated client used by both Next.js (admin) and the API layer the Expo app talks to. Add a boulder in the admin → mobile sees it on next pull. Change a grade → both surfaces update. The data model becomes the contract, not a translation layer.",
              "Auth is the second contract: roles decide who edits what (admin / gym staff / climber). Demo data is the third: realistic seeded content with real images so the platform looks like a product when it boots, not a blank schema waiting for input.",
            ],
            [
              "Klim-apps voor consumenten negeren meestal de beheerderskant: ze gaan ervan uit dat gymcontent vanzelf verschijnt. Gym-admintools negeren juist de klimmerskant: het zijn spreadsheets met een login. Geen van beide snapt dat dezelfde gym → muur → sector → boulder-hiërarchie aan beide kanten leeft en synchroon moet blijven.",
              "Het Prisma-model is de brug. Eén schema, één gegenereerde client die zowel door Next.js (admin) als door de API-laag van de Expo-app wordt gebruikt. Voeg een boulder toe in de admin → mobiel ziet het bij de volgende pull. Wijzig een graad → beide kanten updaten. Het datamodel wordt het contract, niet een vertaallaag.",
              "Authenticatie is het tweede contract: rollen bepalen wie wat bewerkt (admin / gymmedewerker / klimmer). Demodata is het derde: realistisch gevulde content met echte foto's, zodat het platform er bij het opstarten als een product uitziet en niet als een leeg schema dat op invoer wacht.",
            ],
          ),
          media: [],
        },

        /* ── 4. Architecture (Tooling cards) ───────────────────── */
        tooling: [
          {
            eyebrow: loc("01 · Next.js admin", "01 · Next.js-admin"),
            title: loc("Operator surface", "Beheerderskant"),
            description: loc(
              "Next.js App Router admin panel for managing gyms, walls, sectors, boulders, users and roles. Server actions handle mutations, the Prisma client owns persistence, Tailwind keeps the UI quiet and operator-shaped instead of consumer-flashy.",
              "Een Next.js App Router-adminpaneel voor het beheren van gyms, muren, sectoren, boulders, gebruikers en rollen. Server actions verzorgen de mutaties, de Prisma-client beheert de persistentie en Tailwind houdt de UI rustig en beheerdersgericht in plaats van flashy voor consumenten.",
            ),
          },
          {
            eyebrow: "02 · PostgreSQL + Prisma",
            title: loc("Shared data model", "Gedeeld datamodel"),
            description: loc(
              "One PostgreSQL database, one Prisma schema. The model encodes the real climbing hierarchy — gym → wall → sector → boulder — plus accounts, sessions, logs, likes and comments. The generated Prisma client is the same on both ends, so types stay aligned.",
              "Eén PostgreSQL-database, één Prisma-schema. Het model legt de echte klimhiërarchie vast — gym → muur → sector → boulder — plus accounts, sessies, logs, likes en reacties. De gegenereerde Prisma-client is aan beide kanten dezelfde, zodat de types op elkaar afgestemd blijven.",
            ),
          },
          {
            eyebrow: "03 · Expo / React Native",
            title: loc("Mobile climber surface", "Mobiele klimmerskant"),
            description: loc(
              "Expo + React Native client for the climber-facing flow. Browse gyms and walls, see boulders, log session attempts, react to other climbers' sends. Shares its data shape with the admin via the generated Prisma types — the API contract is one source of truth.",
              "Een Expo + React Native-client voor de klimmersflow. Blader door gyms en muren, bekijk boulders, log sessiepogingen en reageer op de sends van andere klimmers. Deelt zijn datavorm met de admin via de gegenereerde Prisma-types — het API-contract is één bron van waarheid.",
            ),
          },
          {
            eyebrow: loc("04 · Auth + role layer", "04 · Auth- en rollenlaag"),
            title: loc("Who can see what", "Wie wat mag zien"),
            description: loc(
              "Role-based access threaded through both surfaces. Admins manage the whole content tree; gym staff scope to their own gym; climbers see public content and their own session history. The same auth identity works across web admin and mobile.",
              "Rolgebaseerde toegang door beide kanten heen. Admins beheren de hele contentboom; gymmedewerkers blijven bij hun eigen gym; klimmers zien publieke content en hun eigen sessiegeschiedenis. Dezelfde auth-identiteit werkt over de web-admin en mobiel heen.",
            ),
          },
        ],

        /* ── 5. What it has (Engineering cards, relabelled) ──── */
        engineering: [
          {
            index: "01",
            title: loc("Auth + roles", "Auth + rollen"),
            body: loc(
              "Account model with role-gated access. Admin vs gym-staff vs climber permissions enforced at the API layer, not just hidden in the UI — both surfaces respect the same boundaries.",
              "Een accountmodel met rolgebaseerde toegang. Rechten voor admin, gymmedewerker en klimmer worden afgedwongen in de API-laag, niet alleen verstopt in de UI — beide kanten respecteren dezelfde grenzen.",
            ),
          },
          {
            index: "02",
            title: loc("Climbing content model", "Klim-datamodel"),
            body: loc(
              "Gyms, walls, sectors, boulders — modelled the way climbers actually talk about them. Grades, tags, photos and short descriptions per boulder; the hierarchy makes navigation in both UIs feel obvious.",
              "Gyms, muren, sectoren, boulders — gemodelleerd zoals klimmers er echt over praten. Graden, tags, foto's en korte beschrijvingen per boulder; de hiërarchie maakt navigeren in beide UI's vanzelfsprekend.",
            ),
          },
          {
            index: "03",
            title: loc("Session logs", "Sessielogs"),
            body: loc(
              "Climbers log attempts and sends against specific boulders. The model captures session date, climber, boulder, attempt count and outcome — enough to render a personal history and feed any future analytics.",
              "Klimmers loggen pogingen en sends op specifieke boulders. Het model legt sessiedatum, klimmer, boulder, aantal pogingen en uitkomst vast — genoeg voor een persoonlijke geschiedenis en input voor toekomstige analytics.",
            ),
          },
          {
            index: "04",
            title: loc("Likes + comments", "Likes + reacties"),
            body: loc(
              "Lightweight social on the climbing content. Climbers can react to a boulder or another climber's session note. Kept deliberately small — this is a tracker with a community layer, not a social network.",
              "Lichte sociale functies op de klimcontent. Klimmers kunnen reageren op een boulder of op de sessienotitie van een andere klimmer. Bewust klein gehouden — dit is een tracker met een communitylaag, geen sociaal netwerk.",
            ),
          },
          {
            index: "05",
            title: loc(
              "Demo dataset with real media",
              "Demodataset met echte media",
            ),
            body: loc(
              "Seeded data with realistic climbing photos and a backend demo capture. Means the platform looks alive on first boot — both surfaces render production-shaped content rather than placeholder skeletons.",
              "Geseede data met realistische klimfoto's en een backend-demo-opname. Daardoor oogt het platform meteen levend bij het opstarten — beide kanten tonen productie-waardige content in plaats van lege skeletten.",
            ),
          },
        ],

        /* ── 6. Visual showcase via mediaDir ────────────────────── */
        showcase: [],

        /* ── 7. Learnings ──────────────────────────────────────── */
        results: {
          paragraphs: locArr(
            [
              "The schema is the product. Every time the admin and mobile started drifting it was because the data model was wrong somewhere. Fixing it once in Prisma fixed both surfaces — cheaper than parallel patches on either side.",
              "Roles deserve real boundaries. Hiding admin-only controls in the UI feels safe until you remember the API is the actual boundary. Server-side role checks are the only ones that count; everything in the UI is just polite.",
              "Demo data is part of the build. A working seed with realistic content turns 'is the platform working' into a question you can answer at a glance — for me, for visitors, for any future collaborator.",
              "Mobile + web from one stack pays compounding interest. Sharing the Prisma client means a backend change ripples through both clients in one PR. The alternative (separate type generation per surface) would have cost real time.",
            ],
            [
              "Het schema is het product. Telkens als de admin en mobiel uit elkaar begonnen te lopen, kwam dat doordat het datamodel ergens fout zat. Het één keer in Prisma oplossen repareerde beide kanten — goedkoper dan parallelle patches aan elke kant.",
              "Rollen verdienen echte grenzen. Admin-only knoppen verbergen in de UI voelt veilig, tot je je herinnert dat de API de echte grens is. Alleen rolcontroles aan de serverkant tellen; alles in de UI is slechts beleefdheid.",
              "Demodata hoort bij de build. Een werkende seed met realistische content verandert 'werkt het platform' in een vraag die je in één oogopslag beantwoordt — voor mezelf, voor bezoekers, voor elke toekomstige medewerker.",
              "Mobiel + web vanuit één stack levert samengestelde rente op. Door de Prisma-client te delen, raakt een backendwijziging beide clients in één PR. Het alternatief (aparte type-generatie per kant) had echt tijd gekost.",
            ],
          ),
        },

        /* ── 8. Closing ────────────────────────────────────────── */
        closing: locArr(
          [
            "BoulderBuddy is still in progress, but both surfaces now run on the same data: the admin loop on the left of the showcase, the mobile loop on the right, both reading from one Prisma schema and one auth identity.",
            "The bet is that climbing software gets better when both sides share a model. Even as a school-and-side project, the platform shape teaches more than another single-purpose tracker would.",
          ],
          [
            "BoulderBuddy is nog in ontwikkeling, maar beide kanten draaien nu op dezelfde data: de admin-loop links in de showcase, de mobiele loop rechts, allebei lezend uit één Prisma-schema en één auth-identiteit.",
            "De gok is dat klimsoftware beter wordt wanneer beide kanten één model delen. Zelfs als school- en hobbyproject leert de vorm van dit platform meer dan zoveelste tracker met één doel zou doen.",
          ],
        ),
      },
    },
  },
];

// Card/gallery media is locale-independent — merge it once at module load,
// then resolve the inline translations (`loc` / `locArr`) per request.
const mediaApplied = applyProjectMedia(baseProjects);

/** Stable, locale-independent slug list for `generateStaticParams`. */
export const projectSlugs: string[] = mediaApplied.map((p) => p.slug);

/** All projects, resolved to the requested locale. */
export function getProjects(locale: Locale): Project[] {
  return mediaApplied.map((p) => resolveLocalizedDeep(p, locale));
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((p) => p.featured);
}

export function getOtherProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((p) => !p.featured);
}

export function getProjectBySlug(
  slug: string,
  locale: Locale,
): Project | undefined {
  return getProjects(locale).find((p) => p.slug === slug);
}
