import { ProjectMediaFrame } from "@/components/ui/ProjectMedia";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: Project[];
  /** Visual density. "list" = full case-study rows (default).
   *  "compact" = thinner rows for an "Other projects" list. */
  layout?: "list" | "compact";
}

/**
 * Reusable project grid. Renders projects as editorial case-study rows,
 * one project per row, hairline-divided. Used by the home page's
 * FeaturedProjects section and by the /projects overview page.
 */
export function ProjectGrid({ projects, layout = "list" }: ProjectGridProps) {
  return (
    <div className="border-t border-border">
      {projects.map((project, i) => (
        <ProjectRow
          key={project.slug}
          project={project}
          index={i}
          total={projects.length}
          layout={layout}
        />
      ))}
    </div>
  );
}

interface ProjectRowProps {
  project: Project;
  index: number;
  total: number;
  layout: "list" | "compact";
}

function caseHref(project: Project): string {
  return project.links?.case ?? `/projects/${project.slug}`;
}

function ProjectRow({ project, index, total, layout }: ProjectRowProps) {
  const idx = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const isCompact = layout === "compact";

  return (
    <article
      className={cn(
        "group relative border-b border-border",
        isCompact ? "py-8 sm:py-10" : "py-12 sm:py-16",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-700 ease-out group-hover:w-full"
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-10",
          isCompact ? "lg:grid-cols-12 lg:gap-10" : "lg:grid-cols-12 lg:gap-12",
        )}
      >
        <div className={isCompact ? "lg:col-span-4" : "lg:col-span-5"}>
          <ProjectMediaFrame project={project} index={index} />
        </div>

        <div
          className={cn(
            "flex flex-col",
            isCompact ? "lg:col-span-8" : "lg:col-span-7",
          )}
        >
          <div className="flex items-center gap-4">
            <span className="text-eyebrow text-[10px]">
              <span className="text-accent">{idx}</span>
              <span className="mx-1.5 text-faint">/</span>
              <span>{totalLabel}</span>
            </span>
            <StatusBadge status={project.status} />
          </div>

          <h3
            className={cn(
              "mt-4 text-balance font-medium tracking-[-0.02em] text-foreground",
              isCompact
                ? "text-2xl sm:text-[1.75rem]"
                : "text-3xl sm:text-[2.25rem] sm:leading-[1.1] lg:text-[2.5rem]",
            )}
          >
            {project.title}
          </h3>
          <p className="mt-2 text-base text-muted">{project.tagline}</p>

          {!isCompact && (
            <dl className="mt-8 grid grid-cols-2 gap-y-5 border-y border-border py-5 sm:grid-cols-3 sm:gap-x-6">
              <MetaItem label="Role" value={project.role ?? "—"} />
              <MetaItem label="Year" value={String(project.year)} />
              <MetaItem
                label="Stack"
                value={project.stack.slice(0, 3).join(" · ")}
              />
            </dl>
          )}

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          {!isCompact && project.highlights?.[0] && (
            <div className="mt-6 flex gap-4">
              <span className="text-eyebrow w-16 shrink-0 pt-0.5 text-[10px]">
                Result
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                {project.highlights[0]}
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href={caseHref(project)}
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
                Live site <span aria-hidden>↗</span>
              </a>
            )}
            {project.links?.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
              >
                Source <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
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
