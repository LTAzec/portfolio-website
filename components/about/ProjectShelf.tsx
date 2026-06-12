"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectShelfProps {
  /** Project list to render. Passed in (locale-resolved) by the page so the
   *  shelf stays in sync with the project index. */
  items: Project[];
  className?: string;
}

/**
 * Horizontal project shelf — native overflow-x scroll with snap-x mandatory.
 *
 *   - Single source of truth: pulls from `data/projects.ts` by default.
 *   - Native scroll + scroll-snap. No carousel library, no JS animation.
 *   - Hidden scrollbar; subtle gradient fades at the left and right edges.
 *   - Arrow controls appear only when there's room to scroll that way.
 *     Plain-mouse-wheel users would otherwise have no obvious way to move
 *     the shelf (browsers don't translate vertical wheel into horizontal
 *     scroll without shift). The buttons fall back to scrollBy on click.
 *   - Each card is a `<Link>` to /projects/[slug] — adding a project to
 *     `data/projects.ts` automatically adds a card here.
 *   - Cards bleed past the Container's horizontal padding so the right
 *     edge can fade naturally, while card content still aligns with the
 *     editorial column above via matching `scroll-padding`.
 *
 * Marked `"use client"` because the arrow controls need scroll-position
 * state. The data import works the same on either side.
 */
export function ProjectShelf({ items, className }: ProjectShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const handleScroll = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    // Move by ~85% of the visible width so the next snap target lines up
    // cleanly without skipping a card on narrow viewports.
    const amount = Math.max(280, Math.round(el.clientWidth * 0.85)) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className={cn("relative -mx-6 sm:-mx-8 lg:-mx-10", className)}>
      <div
        ref={scrollRef}
        role="region"
        aria-label="Project shelf"
        className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-px-8 lg:scroll-px-10 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="m-0 flex list-none flex-nowrap gap-4 px-6 pt-1 pb-3 sm:gap-5 sm:px-8 lg:px-10">
          {items.map((project, i) => (
            <li
              key={project.slug}
              className="w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]"
            >
              <ShelfCard project={project} index={i} />
            </li>
          ))}
        </ul>
      </div>

      {/* Edge fades — visual hint that the row is scrollable */}
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent sm:w-14"
      />
      <div
        aria-hidden
        className="from-background pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent sm:w-14"
      />

      {/* Scroll controls — clickable fallback for users without trackpads */}
      <ScrollButton
        side="left"
        enabled={canLeft}
        onClick={() => handleScroll(-1)}
      />
      <ScrollButton
        side="right"
        enabled={canRight}
        onClick={() => handleScroll(1)}
      />
    </div>
  );
}

function ScrollButton({
  side,
  enabled,
  onClick,
}: {
  side: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        side === "left" ? "Scroll projects left" : "Scroll projects right"
      }
      onClick={onClick}
      tabIndex={enabled ? 0 : -1}
      aria-hidden={!enabled}
      className={cn(
        "ring-highlight bg-charcoal-strong/85 border-border-strong absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border text-foreground shadow-[0_10px_24px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-200",
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4",
        enabled
          ? "opacity-100 hover:bg-charcoal-strong hover:border-accent/60 hover:text-accent"
          : "pointer-events-none opacity-0",
      )}
    >
      <span aria-hidden className="font-mono text-[15px] leading-none">
        {side === "left" ? "←" : "→"}
      </span>
    </button>
  );
}

const STATUS_KEY: Record<Project["status"], string> = {
  live: "live",
  "in-progress": "inProgress",
  private: "private",
  concept: "concept",
};

function ShelfCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations("common");
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="ring-highlight group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-charcoal/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-charcoal-strong/70"
    >
      <CardMedia project={project} index={index} />

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-eyebrow text-[10px]">
            <span className="text-accent">{project.stack[0]}</span>
            <span className="mx-1.5 text-faint">·</span>
            <span>{project.year}</span>
          </span>
          <span className="font-mono text-[9.5px] tracking-[0.08em] text-muted uppercase">
            {t(`status.${STATUS_KEY[project.status]}`)}
          </span>
        </div>

        <h3 className="text-[17px] font-medium tracking-[-0.005em] text-foreground">
          {project.title}
        </h3>

        <p className="line-clamp-2 text-[13.5px] leading-[1.55] text-muted">
          {project.tagline}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {project.stack.slice(0, 4).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        <span
          aria-hidden
          className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-muted transition-colors group-hover:text-accent"
        >
          {t("viewCase")}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function CardMedia({ project, index }: { project: Project; index: number }) {
  const wrapper =
    "relative aspect-[16/10] overflow-hidden border-b border-border bg-charcoal-strong";
  const sizes = "(min-width: 1024px) 360px, (min-width: 640px) 320px, 280px";

  if (project.media?.type === "image") {
    return (
      <div className={wrapper}>
        <Image
          src={project.media.src}
          alt={project.media.alt ?? project.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  if (project.media?.type === "video") {
    return (
      <div className={wrapper}>
        <video
          src={project.media.src}
          poster={project.media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={project.media.alt ?? project.title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (project.image) {
    return (
      <div className={wrapper}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  const idx = String(index + 1).padStart(2, "0");
  return (
    <div className={wrapper}>
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[44px] tracking-[0.02em] text-foreground/25">
          {idx}
        </span>
      </div>
    </div>
  );
}
