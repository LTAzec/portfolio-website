import { assetExists } from "@/lib/asset-utils";
import { cn } from "@/lib/utils";

interface VideoPanelProps {
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  /** Tailwind aspect class. Defaults to 16/10. */
  aspect?: string;
  className?: string;
  /** When true and the video isn't on disk, render nothing instead of a
   *  slot placeholder. Used by showcase rows that should collapse cleanly
   *  when the loop isn't available yet. */
  hideIfMissing?: boolean;
  /** Video fit inside the frame. "cover" (default) crops to fill the
   *  aspect frame; "contain" shows the whole video in its native aspect
   *  with no crop and no baseline scale — the frame hugs the video. */
  fit?: "cover" | "contain";
  /** CSS scale factor — when set, overrides the default 1.02 baseline
   *  scale. Use a higher value (e.g. 1.05) to crop past source-video
   *  letterbox edges. Ignored under fit="contain". */
  zoom?: number;
  /** CSS object-position for fine-tuning the visible crop. */
  objectPosition?: string;
}

/**
 * Autoplay, muted, looping video in a glass frame — no controls, no chrome.
 * Used for ambient product footage in the case study showcase.
 *
 * Falls back to a slot placeholder if the file isn't on disk yet, matching
 * the EditorialImage behaviour so the page can ship pre-asset-drop. With
 * `hideIfMissing`, the entire frame collapses to null instead.
 */
export function VideoPanel({
  src,
  poster,
  alt,
  caption,
  aspect = "aspect-[16/10]",
  className,
  hideIfMissing = false,
  fit = "cover",
  zoom,
  objectPosition,
}: VideoPanelProps) {
  const present = assetExists(src);

  if (!present && hideIfMissing) return null;

  const isContain = fit === "contain";

  // Under contain the aspect ratio lives on the video element itself
  // (w-full h-auto) so the bordered frame shrink-wraps the video with no
  // letterbox padding. Under cover the frame owns the aspect and the video
  // fills it absolutely.
  const frame = (
    <div
      className={cn(
        "ring-highlight relative w-full overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_22px_56px_-26px_rgba(0,0,0,0.7)]",
        // Cover always owns the aspect; contain hands it to the video so the
        // frame hugs it — except for the placeholder, which needs a sized box.
        (!isContain || !present) && aspect,
        className,
      )}
    >
      {present ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
          className={cn(
            "will-change-transform",
            // Contain: no forced aspect box — the video sizes to its own
            // intrinsic ratio (h-auto) so the bordered frame wraps the real
            // pixels exactly, with no pillarbox/letterbox gap.
            isContain
              ? "block h-auto w-full object-contain"
              : "h-full w-full object-cover",
            // Default baseline scale only under cover, when no zoom is set.
            !isContain && zoom === undefined && "scale-[1.02]",
          )}
          style={
            !isContain && (zoom !== undefined || objectPosition)
              ? {
                  transform: zoom !== undefined ? `scale(${zoom})` : undefined,
                  objectPosition,
                }
              : undefined
          }
        />
      ) : (
        <VideoSlotPlaceholder src={src} alt={alt} />
      )}
    </div>
  );

  if (!caption) return frame;

  return (
    <figure className="flex flex-col gap-3">
      {frame}
      <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
        <span className="h-px w-4 bg-faint" />
        <span className="text-muted tracking-[0.04em] normal-case">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}

function VideoSlotPlaceholder({ src, alt }: { src: string; alt: string }) {
  const filename = src.split("/").pop() ?? src;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-charcoal-strong p-6">
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-border-strong/60"
      />
      <div className="relative flex flex-col items-center gap-2 text-center">
        <span className="text-eyebrow text-[10px] text-accent">Video slot</span>
        <span className="font-mono text-[11px] text-foreground/80">
          {filename}
        </span>
        <span className="max-w-[30ch] text-[11px] leading-snug text-muted">
          {alt}
        </span>
      </div>
    </div>
  );
}
