import type { TimelineItem } from "@/lib/types";
import { loc, locArr } from "@/lib/i18n";

/**
 * Background entries for the About page. Sourced from the actual CV.
 * Filtered downstream by `type`:
 *   - "work" / "studio" → BackgroundSection (featured + compact rows)
 *   - "education"       → Education Timeline
 *
 * The AZ Turnhout entry is the featured one — the rest are deliberately
 * compact so the section reads honestly (one real software role, with
 * supporting context) rather than padding three jobs into the same weight.
 *
 * `year`, `featured` and `type` are control fields and stay untranslated;
 * the prose is bilingual via loc()/locArr().
 */
export const experience: TimelineItem[] = [
  {
    year: "2024 — 2025",
    title: loc("Software Engineering Internship", "Stage software engineering"),
    meta: loc("AZ Turnhout — regional hospital", "AZ Turnhout — regionaal ziekenhuis"),
    category: loc("Software", "Software"),
    featured: true,
    body: locArr(
      [
        "Internship in the pharmacy department at AZ Turnhout. End-to-end build of the internal tooling around their bereidings-logboek — a SQL Server back-end with a repository layer of stored procedures, a Next.js front-end for daily use, a Python pipeline that migrated the legacy FileMaker data into the new schema, and a small PowerShell tool for AD-bound Microsoft 365 licence management.",
        "What it actually taught me: how internal software is used in practice. Non-technical users, fragile existing workflows, and a strong need for idempotent migrations, audit-friendly logging and a UI that maps onto the paper rhythm people already trust. Most of the value was in the unglamorous parts — making the flow not break, not in shipping new features.",
      ],
      [
        "Stage bij de apotheekafdeling van AZ Turnhout. End-to-end gebouwde interne tooling rond hun bereidingslogboek — een SQL Server-backend met een repository-laag van stored procedures, een Next.js-frontend voor dagelijks gebruik, een Python-pipeline die de oude FileMaker-data naar het nieuwe schema migreerde, en een kleine PowerShell-tool voor Microsoft 365-licentiebeheer gekoppeld aan Active Directory.",
        "Wat het me echt leerde: hoe interne software in de praktijk wordt gebruikt. Niet-technische gebruikers, kwetsbare bestaande workflows en een sterke behoefte aan idempotente migraties, controleerbare logging en een UI die aansluit op het papieren ritme dat mensen al vertrouwen. De meeste waarde zat in de onglamoureuze delen — zorgen dat de flow niet breekt, niet in nieuwe features.",
      ],
    ),
    description: loc(
      "Internal pharmacy tooling — SQL Server, Next.js, Python migration pipeline and a PowerShell licence utility. Real users, real workflows, end-to-end ownership.",
      "Interne apotheektooling — SQL Server, Next.js, een Python-migratiepipeline en een PowerShell-licentietool. Echte gebruikers, echte workflows, eigenaarschap van begin tot eind.",
    ),
    type: "work",
  },
  {
    year: "2023 — 2024",
    title: loc("First Line Support", "Eerstelijns support"),
    meta: "CMC",
    category: loc("Support", "Support"),
    description: loc(
      "First-line IT support — diagnosing incidents, walking non-technical users through fixes, and translating vague problem reports into clear next steps. Where I learned to listen first and reach for the keyboard second.",
      "Eerstelijns IT-support — incidenten diagnosticeren, niet-technische gebruikers door oplossingen loodsen en vage probleemmeldingen vertalen naar duidelijke vervolgstappen. Hier leerde ik eerst te luisteren en pas daarna naar het toetsenbord te grijpen.",
    ),
    type: "work",
  },
  {
    year: "Seasonal",
    title: loc("Snowboard Instructor · Animator", "Snowboardinstructeur · animator"),
    meta: "Ski & Snowboard Kempen",
    category: loc("Coaching", "Coaching"),
    description: loc(
      "Teaching snowboard groups across all levels. Reading a room, breaking complex movements into steps, keeping a group calm and confident. The same soft skills that show up later when explaining a refactor or migration to a non-technical stakeholder.",
      "Snowboardgroepen lesgeven op alle niveaus. Een groep aanvoelen, complexe bewegingen in stappen opdelen, een groep rustig en zelfverzekerd houden. Dezelfde soft skills die later terugkomen bij het uitleggen van een refactor of migratie aan een niet-technische stakeholder.",
    ),
    type: "work",
  },
  {
    year: "2022 — 2025",
    title: loc("Associate Degree · Programmeren", "Associate degree · Programmeren"),
    meta: "Thomas More — Geel",
    description: loc(
      "Three-year associate programme focused on software development: object-oriented programming, databases, REST APIs, full-stack web and mobile, and applied real-world projects. Foundation for everything in the studio today.",
      "Driejarige associate-opleiding gericht op softwareontwikkeling: objectgeoriënteerd programmeren, databases, REST API's, full-stack web en mobiel, en toegepaste praktijkprojecten. De basis voor alles in de studio van vandaag.",
    ),
    type: "education",
  },
];
