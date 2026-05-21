import { AzecWordmark } from "@/components/brand/AzecWordmark";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { featuredProjects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Selected work — editorial case-study list. One project per row,
 * 5/7 split on desktop: visual placeholder left, content right.
 *
 * Rows are separated by hairline rules. Each row has a sweep-in
 * accent rule on hover and a corner accent dash, matching the AZEC
 * wordmark's hairline-and-stroke language.
 *
 * The visual block is a "preview frame" ready for real screenshots
 * — drop into the data-layer `image` field and swap the placeholder.
 */
export function FeaturedProjects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Recent {projects} — shipped end-to-end."
          subtitle="A snapshot of recent work — internal tooling, AI products, marketing sites, and personal projects."
        />

        <div className="mt-16 border-t border-border">
          {featuredProjects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={i}
              total={featuredProjects.length}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface ProjectRowProps {
  project: Project;
  index: number;
  total: number;
}

function ProjectRow({ project, index, total }: ProjectRowProps) {
  const idx = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <article className="group relative border-b border-border py-12 sm:py-16">
      {/* Sweep-in accent rule across the top */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-700 ease-out group-hover:w-full"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* ── Visual ─────────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <ProjectVisual project={project} index={index} />
        </div>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:col-span-7">
          {/* Top meta */}
          <div className="flex items-center gap-4">
            <span className="text-eyebrow text-[10px]">
              <span className="text-accent">{idx}</span>
              <span className="mx-1.5 text-faint">/</span>
              <span>{totalLabel}</span>
            </span>
            <StatusBadge status={project.status} />
          </div>

          {/* Title + tagline */}
          <h3 className="mt-4 text-balance text-3xl font-medium tracking-[-0.02em] text-foreground sm:text-[2.25rem] sm:leading-[1.1] lg:text-[2.5rem]">
            {project.title}
          </h3>
          <p className="mt-2 text-base text-muted">{project.tagline}</p>

          {/* Meta block — Role · Year · Stack */}
          <dl className="mt-8 grid grid-cols-2 gap-y-5 border-y border-border py-5 sm:grid-cols-3 sm:gap-x-6">
            <MetaItem label="Role" value={project.role ?? "—"} />
            <MetaItem label="Year" value={String(project.year)} />
            <MetaItem
              label="Stack"
              value={project.stack.slice(0, 3).join(" · ")}
            />
          </dl>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          {/* Result (first highlight) */}
          {project.highlights?.[0] && (
            <div className="mt-6 flex gap-4">
              <span className="text-eyebrow w-16 shrink-0 pt-0.5 text-[10px]">
                Result
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                {project.highlights[0]}
              </span>
            </div>
          )}

          {/* Full stack tags */}
          <div className="mt-8 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href={project.links?.case ?? "#projects"}
              className="group/case inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent"
            >
              View case
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover/case:translate-x-0.5"
              >
                →
              </span>
            </a>
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
              >
                Live site
                <span aria-hidden>↗</span>
              </a>
            )}
            {project.links?.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
              >
                Source
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Engineering-aesthetic placeholder frame. Holds the slot for a real
 * screenshot via `project.image` once available. Composed elements:
 *  - hairline border + slight charcoal gradient
 *  - huge faded index number (top-left)
 *  - stack category label (bottom-left)
 *  - small "Preview pending" mono note (bottom-right)
 *  - subtle AZEC wordmark watermark behind everything
 */
function ProjectVisual({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const idx = String(index + 1).padStart(2, "0");

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-charcoal-strong ring-highlight">
      {/* Soft accent wash */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(135deg, rgba(45,123,255,0.06) 0%, transparent 55%)",
        }}
      />

      {/* Wordmark watermark */}
      <AzecWordmark
        label=""
        className="absolute top-1/2 left-1/2 h-auto w-[60%] -translate-x-1/2 -translate-y-1/2 text-foreground opacity-[0.045]"
      />

      {/* Accent dash, top-left */}
      <span
        aria-hidden
        className="absolute top-5 left-5 h-px w-10 bg-accent"
      />

      {/* Index numeral */}
      <span
        aria-hidden
        className="absolute top-5 left-5 mt-4 font-mono text-[8rem] leading-none tracking-tight text-foreground/[0.06] sm:text-[10rem]"
      >
        {idx}
      </span>

      {/* Stack category, bottom-left */}
      <span className="text-eyebrow absolute bottom-5 left-5 text-[10px]">
        {project.stack[0]}
      </span>

      {/* Status, bottom-right */}
      <span className="text-eyebrow absolute right-5 bottom-5 text-[10px]">
        Preview pending
      </span>
    </div>
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

function StatusBadge({ status }: { status: Project["status"] }) {
  const labels: Record<Project["status"], string> = {
    live: "Live",
    "in-progress": "In progress",
    private: "Private",
    concept: "Concept",
  };
  const tones: Record<Project["status"], string> = {
    live: "text-accent border-accent/40",
    "in-progress": "text-foreground border-border-strong",
    private: "text-muted border-border",
    concept: "text-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        tones[status],
      )}
    >
      {status === "live" && (
        <span className="animate-pulse-glow h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      {labels[status]}
    </span>
  );
}
