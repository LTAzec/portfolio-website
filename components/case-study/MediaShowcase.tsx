"use client";

import type * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ImageLightbox } from "./ImageLightbox";
import type {
  CaseStudyVideoRef,
  EditorialImageRef,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export interface MediaShowcaseProps {
  media: {
    images: EditorialImageRef[];
    videos: CaseStudyVideoRef[];
  };
  eyebrow: string;
  heading: string;
  description?: string;
  /** Layout variant.
   *  - "default": primary tile + secondary 2-col grid (Jansen-style).
   *  - "split": tall primary left + stacked secondaries right.
   *  - "platform-split": 2-tile asymmetric grid (lg:col-span-2 + col-span-1)
   *    with optional labels above each tile — used for full-stack platform
   *    case studies where a wide admin/web surface sits next to a narrow
   *    mobile surface, each preserving its native aspect ratio. */
  variant?: "default" | "split" | "platform-split";
}

/**
 * Non-tabbed visual showcase used by single-folder case studies (Jansen,
 * future client work). Same curation + lightbox vocabulary as
 * InternalProjectsShowcase, without the tab navigator.
 */
export function MediaShowcase({
  media,
  eyebrow,
  heading,
  description,
  variant = "default",
}: MediaShowcaseProps) {
  const curated = useMemo(() => curateMedia(media), [media]);

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
          ) : variant === "platform-split" ? (
            <PlatformSplitLayout
              curated={curated}
              onOpenImage={onOpenImage}
            />
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

/**
 * Platform-split layout: two tiles side-by-side on desktop (lg:col-span-2 +
 * lg:col-span-1 of a 3-col grid), stacked on mobile. Each tile gets an
 * optional label above it (e.g. "Admin / Backend", "Mobile App") and
 * preserves its native aspect via per-media aspect override. Used to
 * communicate "one platform, two surfaces" in full-stack case studies.
 *
 * Item order: primary becomes the wide left tile, first secondary becomes
 * the narrow right tile. Additional media are ignored — this layout is
 * intentionally a 2-item composition.
 */
function PlatformSplitLayout({
  curated,
  onOpenImage,
}: {
  curated: Curated;
  onOpenImage: (src: string) => void;
}) {
  // Wide left = primary; narrow right = first secondary.
  const left = curated.primary;
  const right = curated.secondary[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-6">
      {left && (
        <div className="lg:col-span-2">
          <PlatformTile media={left} onOpenImage={onOpenImage} />
        </div>
      )}
      {right && (
        <div className="lg:col-span-1">
          <PlatformTile media={right} onOpenImage={onOpenImage} />
        </div>
      )}
    </div>
  );
}

function PlatformTile({
  media,
  onOpenImage,
}: {
  media: CuratedMedia;
  onOpenImage: (src: string) => void;
}) {
  const label = media.ref.label;
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <span className="text-eyebrow text-[10px] tracking-[0.14em] text-accent">
          {label}
        </span>
      )}
      <CuratedFrame
        media={media}
        variant="secondary"
        onOpenImage={onOpenImage}
        // Platform-split shows full surfaces side-by-side: never crop the
        // video — contain inside its native aspect with a dark backdrop.
        videoFit="contain"
      />
    </div>
  );
}

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
  // Trust the discovery order — `discoverMediaFolder` already applies
  // mediaOrder (explicit narrative sequence) with an alphabetical fallback.
  // Re-sorting here by localeCompare would undo any explicit ordering. We
  // still prefer a video as the primary panel — handled below.
  const all: CuratedMedia[] = [
    ...discovered.videos.map((v) => ({ kind: "video" as const, ref: v })),
    ...discovered.images.map((i) => ({ kind: "image" as const, ref: i })),
  ];

  // All-mockup mode: when every item is an image with frame="mockup",
  // skip the primary/secondary split — mockup tiles are already narrow
  // and centered, a dominant primary above would look unbalanced. Render
  // everything in the uniform 2-col grid instead.
  const allMockup =
    all.length > 0 &&
    all.every((m) => m.kind === "image" && m.ref.frame === "mockup");
  if (allMockup) {
    return {
      primary: undefined,
      secondary: all.slice(0, 4),
      hiddenCount: Math.max(0, all.length - 4),
    };
  }

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

/** True when a Tailwind aspect class (e.g. "aspect-[9/16]") is taller than
 *  it is wide. Used to center+cap portrait video tiles under contain. */
function isPortraitAspect(aspect: string): boolean {
  const m = aspect.match(/aspect-\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\]/);
  if (!m) return false;
  return Number(m[1]) < Number(m[2]);
}

function CuratedFrame({
  media,
  variant,
  onOpenImage,
  videoFit = "cover",
}: {
  media: CuratedMedia;
  variant: FrameVariant;
  onOpenImage: (src: string) => void;
  /** How videos fill their frame. "contain" preserves the full native
   *  aspect (no crop) — used by platform-split. Defaults to "cover". */
  videoFit?: "cover" | "contain";
}) {
  // Per-image aspect override (set via mediaOverrides) wins over the
  // variant default — lets long text screenshots take a taller frame
  // without affecting neighbouring tiles.
  const aspect = media.ref.aspect ?? aspectFor(variant);
  if (media.kind === "video") {
    return <VideoTile video={media.ref} aspect={aspect} fit={videoFit} />;
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
  fit = "cover",
}: {
  video: CaseStudyVideoRef;
  aspect: string;
  /** "contain" shows the whole video in its native aspect (no crop) and
   *  drops the default baseline zoom; "cover" fills the frame. */
  fit?: "cover" | "contain";
}) {
  const isContain = fit === "contain";
  // Portrait surfaces (e.g. the mobile 9/16 loop) shouldn't stretch to the
  // full column width — cap and center so the tile reads like a device card.
  const isPortrait = isPortraitAspect(aspect);

  // Optional sound toggle — autoplay is always muted (browser policy), but
  // when `video.soundToggle` is set we render a small overlay button that
  // lets visitors flip muted off and back on via a user gesture. The ref +
  // useEffect path is safer than passing a reactive `muted` prop, which can
  // sometimes desync from the underlying DOM element on rapid re-renders.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <figure
      className={cn(
        "flex flex-col gap-3",
        isContain && isPortrait && "mx-auto w-full max-w-[300px]",
      )}
    >
      <div
        className={cn(
          "ring-highlight relative w-full overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_22px_56px_-26px_rgba(0,0,0,0.7)]",
          // Cover owns the aspect; contain hands it to the video element so
          // the bordered frame shrink-wraps it with no surrounding letterbox.
          !isContain && aspect,
        )}
      >
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={video.alt}
          className={cn(
            "will-change-transform",
            // Contain: no forced aspect box — the video sizes to its own
            // intrinsic ratio (h-auto) so the bordered frame wraps the real
            // pixels exactly, with no pillarbox/letterbox gap. object-contain
            // only guards the brief poster paint before autoplay.
            isContain
              ? "block h-auto w-full object-contain"
              : "h-full w-full object-cover",
            // Default baseline scale only under cover, and only when no
            // per-video zoom override. Contain must never scale or it
            // would crop the very edges we're trying to preserve.
            !isContain && video.zoom === undefined && "scale-[1.02]",
          )}
          style={
            !isContain && (video.zoom !== undefined || video.objectPosition)
              ? {
                  transform:
                    video.zoom !== undefined
                      ? `scale(${video.zoom})`
                      : undefined,
                  objectPosition: video.objectPosition,
                }
              : undefined
          }
        />

        {video.soundToggle && (
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className="ring-highlight absolute right-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-charcoal/65 text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-charcoal-strong/80"
          >
            <span className="sr-only">
              {muted ? "Unmute video" : "Mute video"}
            </span>
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
        )}
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

  // "contain" preserves the full screenshot (no cropping) — used for
  // long text-output captures. We drop the hover-scale and mask overlay
  // for contained images: scaling a letterboxed image looks off, and a
  // gradient mask over visible letterbox bars adds noise.
  // Mockup defaults to contain; explicit fit="cover" wins so a product
  // screenshot can tight-crop inside the same narrow centered mockup card.
  const isMockup = image.frame === "mockup";
  const isContain =
    image.fit === "contain" || (image.fit === undefined && isMockup);
  const imageClasses = isContain
    ? "object-contain"
    : "object-cover transition-transform duration-500 group-hover:scale-[1.025]";

  // Optional crop refinement: objectPosition + zoom give tight-crop
  // control under cover (lets a product screenshot fill the frame past
  // its own empty padding). Both no-op when undefined.
  const imageStyle: React.CSSProperties = {};
  if (image.objectPosition) imageStyle.objectPosition = image.objectPosition;
  if (image.zoom && image.zoom !== 1)
    imageStyle.transform = `scale(${image.zoom})`;

  const inner = (
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
          className={imageClasses}
          style={
            Object.keys(imageStyle).length > 0 ? imageStyle : undefined
          }
        />
        {!isContain && image.mask && image.mask !== "none" && (
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

  // Mockup tiles render as a narrow centered portrait card within their
  // grid cell — caller's grid layout still controls column count.
  if (isMockup) {
    return <div className="mx-auto w-full max-w-[440px]">{inner}</div>;
  }
  return inner;
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

/* Speaker icons for the optional VideoTile sound toggle. Stroke-only SVGs
   that inherit currentColor so they pick up the button's text-foreground. */
function SoundOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function SoundOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
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
