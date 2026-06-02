"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";
import type {
  CaseStudyVideoRef,
  EditorialImageRef,
  InternalProject,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export interface InternalProjectWithMedia extends InternalProject {
  discoveredMedia: {
    images: EditorialImageRef[];
    videos: CaseStudyVideoRef[];
  };
}

interface InternalProjectsShowcaseProps {
  projects: InternalProjectWithMedia[];
  eyebrow?: string;
  heading?: string;
  description?: string;
}

/**
 * Multi-project showcase used inside the AZ Turnhout case study.
 *
 *   - Tab strip at the top — mono numerals + names with an accent
 *     underline indicating the active project. Horizontally scrollable
 *     on narrow viewports.
 *   - Content panel below shows the active project's narrative on the
 *     left and a CURATED media column on the right:
 *
 *         ┌─────────────────┬───────────────────────────┐
 *         │                 │     Primary (large)       │
 *         │   Narrative     │   1 video OR hero image   │
 *         │   (eyebrow,     │                           │
 *         │    title,       ├───────────┬───────────────┤
 *         │    context,     │           │               │
 *         │    built,       │ Secondary │  Secondary    │
 *         │    stack,       │           │               │
 *         │    outcome)     ├───────────┼───────────────┤
 *         │                 │           │               │
 *         │                 │ Secondary │  Secondary    │
 *         │                 │           │               │
 *         │                 ├───────────┴───────────────┤
 *         │                 │ + N supporting archived   │
 *         └─────────────────┴───────────────────────────┘
 *
 *   - Files dropped into the project's mediaDir are sorted by filename;
 *     the first matched video (if any) becomes the primary, then up to
 *     four further entries fill the 2x2 grid. Anything past that gets a
 *     subtle "supporting captures archived" indicator instead of a
 *     gallery dump.
 *   - Existing blur zones / masks on EditorialImageRef are preserved.
 */
export function InternalProjectsShowcase({
  projects,
  eyebrow = "Internal projects",
  heading = "Four apps, one internship",
  description = "Four distinct internal tools shipped under the AZ Turnhout brief. Each one solved its own workflow problem — switch tabs to step through them.",
}: InternalProjectsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (projects.length === 0) return null;

  const active = projects[activeIndex] ?? projects[0];

  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        {/* Section header */}
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="text-eyebrow">{eyebrow}</span>
          <h2 className="text-balance text-[1.875rem] font-medium leading-[1.1] tracking-[-0.022em] text-foreground sm:text-[2.25rem]">
            {heading}
          </h2>
          {description && (
            <p className="text-pretty text-[16px] leading-[1.7] text-muted sm:text-[17px]">
              {description}
            </p>
          )}
        </div>

        {/* Tab strip */}
        <div
          role="tablist"
          aria-label="Internal projects"
          className="mt-12 -mx-6 flex gap-1 overflow-x-auto border-b border-border px-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:gap-2 sm:px-8 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`internal-panel-${p.id}`}
                id={`internal-tab-${p.id}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative flex shrink-0 flex-col items-start gap-1 px-3 py-4 transition-colors duration-200 sm:px-4 sm:py-5",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground/85",
                )}
              >
                <span
                  className={cn(
                    "text-eyebrow text-[9.5px] transition-colors",
                    isActive ? "text-accent" : "text-faint",
                  )}
                >
                  {p.index}
                </span>
                <span className="text-[13.5px] font-medium tracking-[-0.005em] whitespace-nowrap sm:text-[14px]">
                  {p.name}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-px left-0 right-0 h-px transition-colors duration-300",
                    isActive ? "bg-accent" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          key={active.id}
          role="tabpanel"
          id={`internal-panel-${active.id}`}
          aria-labelledby={`internal-tab-${active.id}`}
          className="mt-10 transition-opacity duration-300 ease-out sm:mt-14"
        >
          <ProjectPanel project={active} />
        </div>
      </Container>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Active project panel
   ────────────────────────────────────────────────────────────── */

function ProjectPanel({ project }: { project: InternalProjectWithMedia }) {
  const curated = curateMedia(project.discoveredMedia);

  // All curated images in display order — used as the lightbox playlist so
  // arrow keys / prev-next buttons cycle through the same set the user sees.
  // Videos are intentionally excluded — they autoplay in-place.
  const lightboxImages = useMemo(() => {
    const out: EditorialImageRef[] = [];
    if (curated.primary?.kind === "image") out.push(curated.primary.ref);
    for (const s of curated.secondary) {
      if (s.kind === "image") out.push(s.ref);
    }
    return out;
  }, [curated]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const onOpenImage = useCallback(
    (src: string) => {
      const idx = lightboxImages.findIndex((img) => img.src === src);
      if (idx >= 0) setOpenIndex(idx);
    },
    [lightboxImages],
  );
  const onCloseLightbox = useCallback(() => setOpenIndex(null), []);
  const onLightboxChange = useCallback((idx: number) => setOpenIndex(idx), []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Left column — narrative */}
      <div className="flex flex-col gap-8 lg:col-span-5">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-eyebrow text-[10px]">
              <span className="text-accent">{project.index}</span>
              <span className="mx-1.5 text-faint">·</span>
              <span>{project.name}</span>
            </span>
            {project.status && (
              <span className="font-mono text-[9.5px] tracking-[0.08em] text-muted uppercase">
                {project.status}
              </span>
            )}
          </div>
          <h3 className="text-balance text-[1.625rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[1.875rem]">
            {project.name}
          </h3>
          <p className="text-pretty text-[15px] leading-[1.65] text-muted sm:text-[16px]">
            {project.tagline}
          </p>
        </header>

        <NarrativeBlock label="Context" paragraphs={project.context} />
        <NarrativeBlock label="What was built" paragraphs={project.built} />

        {project.stack.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-eyebrow text-[10px]">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </div>
        )}

        {project.results.length > 0 && (
          <NarrativeBlock label="Outcome" paragraphs={project.results} />
        )}
      </div>

      {/* Right column — curated media */}
      <div className="lg:col-span-7">
        {curated.primary || curated.secondary.length > 0 ? (
          <CuratedMediaColumn curated={curated} onOpenImage={onOpenImage} />
        ) : (
          <EmptyMediaNotice />
        )}
      </div>

      {openIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          index={openIndex}
          onClose={onCloseLightbox}
          onChange={onLightboxChange}
        />
      )}
    </div>
  );
}

function NarrativeBlock({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: string[];
}) {
  if (paragraphs.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="text-eyebrow text-[10px]">{label}</span>
      <div className="flex flex-col gap-3">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-pretty text-[14.5px] leading-[1.7] text-foreground/85 sm:text-[15px]"
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Curation
   Sort by src (which is filename-derived) → prefer first video as
   primary → next four entries are secondary → the rest become a
   subtle "+N archived" indicator.
   ────────────────────────────────────────────────────────────── */

type CuratedMedia =
  | { kind: "video"; ref: CaseStudyVideoRef }
  | { kind: "image"; ref: EditorialImageRef };

interface Curated {
  primary?: CuratedMedia;
  secondary: CuratedMedia[];
  hiddenCount: number;
}

function curateMedia(discovered: {
  images: EditorialImageRef[];
  videos: CaseStudyVideoRef[];
}): Curated {
  const all: CuratedMedia[] = [
    ...discovered.videos.map((v) => ({ kind: "video" as const, ref: v })),
    ...discovered.images.map((i) => ({ kind: "image" as const, ref: i })),
  ].sort((a, b) => a.ref.src.localeCompare(b.ref.src));

  // Prefer a video as the primary — the hero treatment per project.
  const firstVideoIdx = all.findIndex((m) => m.kind === "video");
  let primary: CuratedMedia | undefined;
  if (firstVideoIdx >= 0) {
    primary = all.splice(firstVideoIdx, 1)[0];
  } else if (all.length > 0) {
    primary = all.shift();
  }

  const secondary = all.slice(0, 4);
  const hiddenCount = Math.max(0, all.length - 4);

  return { primary, secondary, hiddenCount };
}

/* ──────────────────────────────────────────────────────────────
   Curated media column (1 primary + up to 4 secondaries + indicator)
   ────────────────────────────────────────────────────────────── */

function CuratedMediaColumn({
  curated,
  onOpenImage,
}: {
  curated: Curated;
  onOpenImage?: (src: string) => void;
}) {
  const { primary, secondary, hiddenCount } = curated;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {primary && (
        <CuratedFrame media={primary} variant="primary" onOpenImage={onOpenImage} />
      )}

      {secondary.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {secondary.map((m) => (
            <CuratedFrame
              key={m.ref.src}
              media={m}
              variant="secondary"
              onOpenImage={onOpenImage}
            />
          ))}
        </div>
      )}

      {hiddenCount > 0 && (
        <p className="text-eyebrow flex items-center gap-2 text-[10px] tracking-[0.12em] text-muted">
          <span aria-hidden className="h-px w-6 bg-faint" />
          <span>
            +{" "}
            {hiddenCount} supporting capture{hiddenCount === 1 ? "" : "s"}{" "}
            archived internally
          </span>
        </p>
      )}
    </div>
  );
}

function CuratedFrame({
  media,
  variant,
  onOpenImage,
}: {
  media: CuratedMedia;
  variant: "primary" | "secondary";
  onOpenImage?: (src: string) => void;
}) {
  const aspect =
    variant === "primary" ? "aspect-[16/10]" : "aspect-[4/3]";
  if (media.kind === "video") {
    return <VideoTile video={media.ref} aspect={aspect} />;
  }
  return (
    <ImageTile
      image={media.ref}
      aspect={aspect}
      variant={variant}
      onOpenImage={onOpenImage}
    />
  );
}

function VideoTile({
  video,
  aspect,
}: {
  video: CaseStudyVideoRef;
  aspect: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={cn(
          "ring-highlight relative w-full overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_22px_56px_-26px_rgba(0,0,0,0.7)]",
          aspect,
        )}
      >
        <video
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={video.alt}
          className="h-full w-full scale-[1.02] object-cover will-change-transform"
        />
      </div>
      {video.caption && (
        <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
          <span className="h-px w-4 bg-faint" />
          <span className="text-muted tracking-[0.04em] normal-case">
            {compactCaption(video.caption)}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function ImageTile({
  image,
  aspect,
  variant,
  onOpenImage,
}: {
  image: EditorialImageRef;
  aspect: string;
  variant: "primary" | "secondary";
  onOpenImage?: (src: string) => void;
}) {
  const sizes =
    variant === "primary"
      ? "(min-width: 1024px) 560px, 100vw"
      : "(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw";

  const clickable = !!onOpenImage;

  return (
    <figure className="flex flex-col gap-3">
      <button
        type="button"
        aria-label={clickable ? `Open ${image.alt} fullscreen` : undefined}
        onClick={clickable ? () => onOpenImage(image.src) : undefined}
        disabled={!clickable}
        className={cn(
          "ring-highlight group relative w-full overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_18px_48px_-22px_rgba(0,0,0,0.55)] transition-transform duration-300",
          aspect,
          clickable
            ? "cursor-zoom-in hover:border-border-strong"
            : "cursor-default",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-500",
            clickable && "group-hover:scale-[1.025]",
          )}
        />
        {image.mask && image.mask !== "none" && (
          <MaskOverlay mask={image.mask} />
        )}
        {image.blurZones?.map((zone, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "pointer-events-none absolute",
              zone.intensity === "strong"
                ? "bg-charcoal-strong/65 backdrop-blur-xl"
                : "bg-charcoal-strong/30 backdrop-blur-md",
            )}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
            }}
          />
        ))}
      </button>
      {image.caption && (
        <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
          <span className="h-px w-4 bg-faint" />
          <span className="text-muted tracking-[0.04em] normal-case">
            {compactCaption(image.caption)}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function MaskOverlay({ mask }: { mask: NonNullable<EditorialImageRef["mask"]> }) {
  const styles: Record<NonNullable<EditorialImageRef["mask"]>, string> = {
    "fade-bottom":
      "bg-gradient-to-b from-transparent via-transparent to-charcoal-strong/95",
    "fade-top":
      "bg-gradient-to-t from-transparent via-transparent to-charcoal-strong/95",
    "fade-edges":
      "bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(11,14,20,0.85)_95%)]",
    none: "",
  };
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", styles[mask])}
    />
  );
}

/** Trim auto-discovered filename captions so they read editorial, not
 *  like a folder dump (`14AantalBatchesUpdateExcel.png` → `AantalBatchesUpdateExcel`). */
function compactCaption(caption: string): string {
  const trimmed = caption
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^[0-9]+[\s_-]*/, "")
    .replace(/[-_]/g, " ")
    .trim();
  if (!trimmed) return caption;
  if (trimmed.length > 48) return trimmed.slice(0, 45).trim() + "…";
  return trimmed;
}

function EmptyMediaNotice() {
  return (
    <div className="ring-highlight flex h-full min-h-[280px] flex-col items-start justify-center gap-3 rounded-xl border border-dashed border-border-strong/60 bg-charcoal/40 p-8 sm:p-10">
      <span className="text-eyebrow text-[10px] text-accent">Media pending</span>
      <p className="max-w-md text-pretty text-[14px] leading-[1.65] text-muted">
        Screenshots and recordings for this project are being prepared for
        release. They land here automatically as soon as the files are dropped
        into the project folder — no code change required.
      </p>
    </div>
  );
}


/* ──────────────────────────────────────────────────────────────
   Fullscreen image lightbox
   ────────────────────────────────────────────────────────────── */

function ImageLightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: EditorialImageRef[];
  index: number;
  onClose: () => void;
  onChange: (idx: number) => void;
}) {
  // Lock body scroll while the lightbox is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        e.preventDefault();
        onChange((index - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight" && images.length > 1) {
        e.preventDefault();
        onChange((index + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onChange]);

  const current = images[index];
  if (!current) return null;

  const hasMultiple = images.length > 1;
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="lightbox-root fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="lightbox-backdrop bg-background/85 absolute inset-0 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Image */}
      <div className="lightbox-image relative max-h-[90vh] max-w-[92vw] sm:max-w-[88vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="block h-auto max-h-[90vh] w-auto max-w-[92vw] rounded-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:max-w-[88vw]"
        />
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:top-6 sm:right-6"
      >
        <span aria-hidden className="font-mono text-base leading-none">
          ✕
        </span>
      </button>

      {/* Prev / Next */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:left-6"
          >
            <span aria-hidden className="font-mono text-lg leading-none">
              ←
            </span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:right-6"
          >
            <span aria-hidden className="font-mono text-lg leading-none">
              →
            </span>
          </button>

          {/* Counter */}
          <div className="text-eyebrow absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] text-foreground/80 sm:bottom-7">
            <span className="text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-faint"> / </span>
            <span>{String(images.length).padStart(2, "0")}</span>
          </div>
        </>
      )}

      {/* Caption */}
      {current.caption && (
        <div className="absolute bottom-14 left-1/2 z-10 max-w-[80vw] -translate-x-1/2 text-center sm:bottom-16">
          <p className="text-eyebrow text-[10px] tracking-[0.08em] text-foreground/70">
            {current.caption}
          </p>
        </div>
      )}

      {/* Scoped keyframes — fade + soft scale entrance */}
      <style>{`
        .lightbox-root .lightbox-backdrop {
          animation: lightboxBackdrop 240ms ease-out both;
        }
        .lightbox-root .lightbox-image {
          animation: lightboxImage 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        @keyframes lightboxBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightboxImage {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lightbox-root .lightbox-backdrop,
          .lightbox-root .lightbox-image {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

