import Image from "next/image";
import { AzecIcon } from "@/components/brand/AzecIcon";
import type { Project, ProjectMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectMediaFrameProps {
  project: Project;
  /** Zero-based index — used by the placeholder to render the numeral. */
  index?: number;
  /** Tailwind aspect-ratio class. Defaults to "aspect-[16/10]". */
  aspect?: string;
  className?: string;
  /** Sizing hint for next/image. */
  sizes?: string;
}

/**
 * Renders project media — image, video, or the engineered placeholder.
 * Used by ProjectGrid rows and by the case study hero media slot.
 */
export function ProjectMediaFrame({
  project,
  index = 0,
  aspect = "aspect-[16/10]",
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: ProjectMediaFrameProps) {
  // Opt-in: show two uncropped platform loops side-by-side (wide backend
  // left, narrow mobile right). Only projects that explicitly set the flag
  // take this branch — every other card renders the single-tile layout
  // below, unchanged.
  if (project.cardMediaLayout === "split-platforms" && project.media) {
    return <SplitPlatformsMedia project={project} className={className} />;
  }
  if (project.media) {
    return <MediaInner media={project.media} aspect={aspect} className={className} sizes={sizes} title={project.title} />;
  }
  return <Placeholder project={project} index={index} aspect={aspect} className={className} />;
}

/**
 * Split-platforms card media: the wide backend/admin loop on the left, the
 * narrow mobile loop on the right — both uncropped in their native ratio
 * (object-contain + intrinsic h-auto, no scale/zoom), so each bordered
 * frame hugs its video. Mirrors the detail-page "one platform, two
 * interfaces" treatment in a compact, list-friendly row that keeps the card
 * roughly the same height as other project cards.
 */
function SplitPlatformsMedia({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const backend = project.media!;
  const mobile = project.cardMediaSecondary;

  // No secondary surface → fall back to a single centered backend tile.
  if (!mobile) {
    return (
      <div className={className}>
        <ContainVideoTile
          media={backend}
          title={project.title}
          label={backend.label}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-4 sm:gap-5", className)}>
      {/* Backend ~72% of the media area. */}
      <div className="min-w-0 flex-[0_0_72%]">
        <ContainVideoTile
          media={backend}
          title={project.title}
          label={backend.label}
        />
      </div>
      {/* Mobile ~28%, centered within its narrow column. */}
      <div className="min-w-0 flex-[0_0_28%]">
        <ContainVideoTile
          media={mobile}
          title={project.title}
          label={mobile.label}
        />
      </div>
    </div>
  );
}

function ContainVideoTile({
  media,
  title,
  label,
  maxWidthClass,
}: {
  media: ProjectMedia;
  title: string;
  label?: string;
  maxWidthClass?: string;
}) {
  // Images degrade gracefully to the same contain treatment.
  const isVideo = media.type === "video";
  return (
    <figure
      className={cn(
        "flex flex-col gap-2",
        maxWidthClass && cn("mx-auto w-full", maxWidthClass),
      )}
    >
      <div className="ring-highlight relative w-full overflow-hidden rounded-lg border border-border bg-charcoal-strong">
        {isVideo ? (
          <video
            src={media.src}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={media.alt ?? title}
            // Intrinsic ratio (h-auto) so the frame wraps the real pixels —
            // no crop, no scale, no surrounding letterbox.
            className="block h-auto w-full object-contain"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt ?? title}
            width={1280}
            height={720}
            className="block h-auto w-full object-contain"
          />
        )}
      </div>
      {label && (
        <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
          <span className="h-px w-4 bg-faint" />
          <span className="text-muted tracking-[0.04em] normal-case">
            {label}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

function MediaInner({
  media,
  aspect,
  className,
  sizes,
  title,
}: {
  media: ProjectMedia;
  aspect: string;
  className?: string;
  sizes: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "ring-highlight relative overflow-hidden rounded-lg border border-border bg-charcoal-strong",
        aspect,
        className,
      )}
    >
      {media.type === "image" ? (
        <Image
          src={media.src}
          alt={media.alt ?? title}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={media.alt ?? title}
          className="h-full w-full object-cover will-change-transform"
          style={
            media.zoom || media.objectPosition
              ? {
                  transform: media.zoom ? `scale(${media.zoom})` : undefined,
                  objectPosition: media.objectPosition,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

function Placeholder({
  project,
  index,
  aspect,
  className,
}: {
  project: Project;
  index: number;
  aspect: string;
  className?: string;
}) {
  const idx = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "ring-highlight relative overflow-hidden rounded-lg border border-border bg-charcoal-strong",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(135deg, rgba(45,123,255,0.06) 0%, transparent 55%)",
        }}
      />

      <AzecIcon
        label=""
        className="absolute top-1/2 left-1/2 h-auto w-[60%] -translate-x-1/2 -translate-y-1/2 text-foreground opacity-[0.045]"
      />

      <span aria-hidden className="absolute top-5 left-5 h-px w-10 bg-accent" />

      <span
        aria-hidden
        className="absolute top-5 left-5 mt-4 font-mono text-[8rem] leading-none tracking-tight text-foreground/[0.06] sm:text-[10rem]"
      >
        {idx}
      </span>

      <span className="text-eyebrow absolute bottom-5 left-5 text-[10px]">
        {project.stack[0]}
      </span>

      <span className="text-eyebrow absolute right-5 bottom-5 text-[10px]">
        Preview pending
      </span>
    </div>
  );
}
