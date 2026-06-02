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
}: VideoPanelProps) {
  const present = assetExists(src);

  if (!present && hideIfMissing) return null;

  const frame = (
    <div
      className={cn(
        "ring-highlight relative w-full overflow-hidden rounded-xl border border-border bg-charcoal-strong shadow-[0_22px_56px_-26px_rgba(0,0,0,0.7)]",
        aspect,
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
          className="h-full w-full scale-[1.02] object-cover will-change-transform"
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
