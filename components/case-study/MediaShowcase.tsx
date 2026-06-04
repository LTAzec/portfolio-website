"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ImageLightbox } from "./ImageLightbox";
import type {
  CaseStudyVideoRef,
  EditorialImageRef,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export interface MediaShowcaseProps {
  /** Discovered media — videos + images for the project. */
  media: {
    images: EditorialImageRef[];
    videos: CaseStudyVideoRef[];
  };
  /** Mono eyebrow label, e.g. "Visual showcase". */
  eyebrow: string;
  /** Section heading. */
  heading: string;
  /** Optional supporting paragraph under the heading. */
  description?: string;
  /** Layout variant — "default" places primary on top + 2x2 below;
   *  "split" places primary as a tall left column with stacked secondaries
   *  on the right. Default is "default". */
  variant?: "default" | "split";
}

/**
 * Non-tabbed visual showcase used by single-folder case studies (Jansen,
 * future client work). Same curation + lightbox vocabulary as
 * InternalProjectsShowcase, without the tab navigator.
 *
 *   - Up to 1 primary media (prefers video) + up to 4 secondary media
 *   - Remaining files become a subtle "+N supporting captures archived" line
 *   - Image tiles open in fullscreen lightbox on click; videos play in-place
 *   - Server-side asset discovery happens upstream — this component is
 *     purely presentational
 */
export function MediaShowcase({
  media,
  eyebrow,
  heading,
  description,
  variant = "default",
}: MediaShowcaseProps) {
  const curated = useMemo(() => curateMedia(media), [media]);

  // Lightbox playlist — all images in display order. Videos are NOT in
  // the lightbox; they autoplay inline.
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

  if (!curated.primary && curated.secondary.length === 0) {
    return (
      <section className="border-b border-border py-16 sm:py-24">
        <Container>
          <Header eyebrow={eyebrow} heading={heading} description={description} />
          <div className="mt-10 sm:mt-14">
            <EmptyMediaNotice />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <Header eyebrow={eyebrow} heading={heading} description={description} />

        <div className="mt-12 sm:mt-16">
          {variant === "split" ? (
            <SplitLayout curated={curated} onOpenImage={onOpenImage} />
          ) : (
            <DefaultLayout curated={curated} onOpenImage={onOpenImage} />
          )}

          {curated.hiddenCount > 0 && (
            <p className="text-eyebrow mt-6 flex items-center gap-2 text-[10px] tracking-[0.12em] text-muted sm:mt-8">
              <span aria-hidden className="h-px w-6 bg-faint" />
              <span>
                + {curated.hiddenCount} supporting capture
                {curated.hiddenCount === 1 ? "" : "s"} archived internally
              </span>
            </p>
          )}
        </div>
      </Container>

      {openIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          index={openIndex}
          onClose={onCloseLightbox}
          onChange={onLightboxChange}
        />
      )}
    </section>
  );
}

function Header({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
}) {
  return (
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
  );
}

/* ──────────────────────────────────────────────────────────────
   Layouts
   ────────────────────────────────────────────────────────────── */

function DefaultLayout({
  curated,
  onOpenImage,
}: {
  curated: Curated;
  onOpenImage: (src: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {curated.primary && (
        <CuratedFrame
          media={curated.primary}
          variant="primary"
          onOpenImage={onOpenImage}
        />
      )}
      {curated.secondary.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {curated.secondary.map((m) => (
            <CuratedFrame
              key={m.ref.src}
              media={m}
              variant="secondary"
              onOpenImage={onOpenImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SplitLayout({
  curated,
  onOpenImage,
}: {
  curated: Curated;
  onOpenImage: (src: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
      {curated.primary && (
        <div className="lg:col-span-7">
          <CuratedFrame
            media={curated.primary}
            variant="split-primary"
            onOpenImage={onOpenImage}
          />
        </div>
      )}
      {curated.secondary.length > 0 && (
        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
          {curated.secondary.slice(0, 3).map((m) => (
            <CuratedFrame
              key={m.ref.src}
              media={m}
              variant="split-secondary"
              onOpenImage={onOpenImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Curation
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
   Frames
   ────────────────────────────────────────────────────────────── */

type FrameVariant = "primary" | "secondary" | "split-primary" | "split-secondary";

function aspectFor(v: FrameVariant): string {
  switch (v) {
    case "primary":
      return "aspect-[16/10]";
    case "secondary":
      return "aspect-[4/3]";
    case "split-primary":
      return "aspect-[3/4] lg:aspect-[5/7]";
    case "split-secondary":
      return "aspect-[4/3]";
  }
}

function CuratedFrame({
  media,
  variant,
  onOpenImage,
}: {
  media: CuratedMedia;
  variant: FrameVariant;
  onOpenImage: (src: string) => void;
}) {
  const aspect = aspectFor(variant);
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
  variant: FrameVariant;
  onOpenImage: (src: string) => void;
}) {
  const sizes =
    variant === "primary" || variant === "split-primary"
      ? "(min-width: 1024px) 700px, 100vw"
      : "(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw";

  return (
    <figure className="flex flex-col gap-3">
      <button
        type="button"
        aria-label={`Open ${image.alt} fullscreen`}
        onClick={() => onOpenImage(image.src)}
        className={cn(
          "ring-highlight group relative w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_18px_48px_-22px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-border-strong",
          aspect,
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
        {image.mask && image.mask !== "none" && <MaskOverlay mask={image.mask} />}
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

function MaskOverlay({
  mask,
}: {
  mask: NonNullable<EditorialImageRef["mask"]>;
}) {
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
    <div className="ring-highlight flex h-full min-h-[260px] flex-col items-start justify-center gap-3 rounded-xl border border-dashed border-border-strong/60 bg-charcoal/40 p-8 sm:p-10">
      <span className="text-eyebrow text-[10px] text-accent">Media pending</span>
      <p className="max-w-md text-pretty text-[14px] leading-[1.65] text-muted">
        Screenshots and recordings for this project are being prepared. They
        land here automatically as soon as the files are dropped into the
        project folder — no code change required.
      </p>
    </div>
  );
}
