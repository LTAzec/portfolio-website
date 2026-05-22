import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ProjectMediaFrame } from "@/components/ui/ProjectMedia";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/types";

interface CaseStudyProps {
  project: Project;
  /** Next project for the bottom nav. Optional — omitted = no next card. */
  nextProject?: Project;
}

/**
 * Editorial case-study layout for a single project.
 *   1. Back link
 *   2. Editorial hero (label + title + tagline)
 *   3. Meta strip
 *   4. Hero media (real or placeholder)
 *   5. Overview · Problem · Solution · Result (5/7 split)
 *   6. Highlights list
 *   7. Built with
 *   8. Next project navigation
 *   9. Bottom back link
 */
export function CaseStudy({ project, nextProject }: CaseStudyProps) {
  const cs = project.caseStudy;

  return (
    <article>
      {/* ── Top: back link ─────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32">
        <Container>
          <Link
            href="/projects"
            className="text-eyebrow group inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              ←
            </span>
            Back to projects
          </Link>
        </Container>
      </section>

      {/* ── Editorial hero ─────────────────────────────────────── */}
      <section className="pt-10 pb-14 sm:pt-14 sm:pb-20">
        <Container>
          <span className="text-eyebrow flex items-center gap-3">
            <span className="text-accent">Case study</span>
            <span className="h-px w-6 bg-faint" />
            <span>{project.year}</span>
          </span>

          <h1 className="mt-6 text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.02]">
            {project.title}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>
        </Container>
      </section>

      {/* ── Meta strip ─────────────────────────────────────────── */}
      <section className="border-y border-border py-7">
        <Container>
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-x-8">
            <MetaItem label="Role" value={project.role ?? "—"} />
            <MetaItem label="Year" value={String(project.year)} />
            <MetaItem
              label="Stack"
              value={project.stack.slice(0, 3).join(" · ")}
            />
            <MetaItem label="Status" value={statusLabel(project.status)} />
          </dl>
        </Container>
      </section>

      {/* ── Hero media ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <Container>
          <ProjectMediaFrame
            project={project}
            aspect="aspect-[16/9]"
            sizes="(min-width: 1024px) 1100px, 100vw"
          />
        </Container>
      </section>

      {/* ── Case study body ────────────────────────────────────── */}
      <CaseBlock label="Overview" content={cs?.overview ?? project.description} />
      <CaseBlock label="Problem" content={cs?.problem ?? "Case study content coming soon."} />
      <CaseBlock label="Solution" content={cs?.solution ?? "Case study content coming soon."} />
      <CaseBlock label="Result" content={cs?.result ?? project.highlights?.[0] ?? "Coming soon."} />

      {/* ── Highlights ─────────────────────────────────────────── */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="border-b border-border py-12 sm:py-16">
          <Container>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="text-eyebrow">Highlights</span>
              </div>
              <ul className="space-y-3 lg:col-span-8">
                {project.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-[15px] leading-relaxed text-foreground/90"
                  >
                    <span className="text-eyebrow w-6 shrink-0 pt-1 text-[10px] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* ── Built with ─────────────────────────────────────────── */}
      <section className="border-b border-border py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <span className="text-eyebrow">Built with</span>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Next project ───────────────────────────────────────── */}
      {nextProject && (
        <section className="py-16 sm:py-24">
          <Container>
            <span className="text-eyebrow">Next case</span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="ring-highlight group mt-5 flex flex-col gap-6 rounded-xl border border-border bg-charcoal/60 p-6 transition-colors hover:border-border-strong hover:bg-charcoal-strong/70 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            >
              <div>
                <div className="text-eyebrow text-[10px]">
                  <span className="text-accent">{nextProject.stack[0]}</span>
                  <span className="mx-1.5 text-faint">·</span>
                  <span>{nextProject.year}</span>
                </div>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {nextProject.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  {nextProject.tagline}
                </p>
              </div>
              <span
                aria-hidden
                className="font-mono text-2xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </Link>
          </Container>
        </section>
      )}

      {/* ── Bottom back link ───────────────────────────────────── */}
      <section className="border-t border-border py-14 sm:py-20">
        <Container>
          <Link
            href="/projects"
            className="text-eyebrow group inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              ↑
            </span>
            Back to all projects
          </Link>
        </Container>
      </section>
    </article>
  );
}

function CaseBlock({ label, content }: { label: string; content: string }) {
  return (
    <section className="border-b border-border py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="text-eyebrow">{label}</span>
          </div>
          <div className="lg:col-span-8">
            <p className="max-w-2xl text-pretty text-[17px] leading-[1.65] text-foreground/90">
              {content}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-eyebrow text-[10px]">{label}</dt>
      <dd className="text-[13px] text-foreground">{value}</dd>
    </div>
  );
}

function statusLabel(status: Project["status"]): string {
  const map: Record<Project["status"], string> = {
    live: "Live",
    "in-progress": "In progress",
    private: "Private",
    concept: "Concept",
  };
  return map[status];
}
