import Image from "next/image";
import { assetExists } from "@/lib/asset-utils";
import { cn } from "@/lib/utils";
import type { BlurZone, EditorialImageRef } from "@/lib/types";

interface EditorialImageProps {
  image: EditorialImageRef;
  /** Override frame sizing — defaults to the image's aspect, falling back to 16/10. */
  className?: string;
  /** next/image sizes hint. */
  sizes?: string;
  /** Drop the rounded glass frame (used for tile-in-stack compositions that
   *  inherit framing from the parent). */
  bare?: boolean;
  /** Priority for above-the-fold images (hero only). */
  priority?: boolean;
  /** When true and the asset isn't on disk, render nothing instead of a
   *  slot placeholder. Used by long-form sections that should collapse
   *  cleanly when assets aren't available yet, rather than show
   *  "drop here" cards in production. */
  hideIfMissing?: boolean;
}

/**
 * Editorial wrapper around `next/image` with case-study-grade treatments:
 *
 *   • Renders a slot placeholder when the source file isn't on disk yet
 *     (or, with `hideIfMissing`, nothing at all).
 *   • Layered redaction: caller passes `blurZones` (percentage coords)
 *     to obscure specific regions on top of whatever blur the asset
 *     already has.
 *   • Optional gradient masks (`mask`) to soften unreadable detail at
 *     image edges — useful for table screenshots where only the first
 *     few rows need to be legible.
 *   • Mono caption rail underneath for editorial framing.
 *
 * Server component — reads the public directory at render time to decide
 * between real image vs placeholder vs hidden.
 */
export function EditorialImage({
  image,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  bare = false,
  priority = false,
  hideIfMissing = false,
}: EditorialImageProps) {
  const aspect = image.aspect ?? "aspect-[16/10]";
  const present = assetExists(image.src);

  if (!present && hideIfMissing) return null;

  const frame = (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        !bare &&
          "ring-highlight rounded-xl border border-border bg-charcoal-strong shadow-[0_18px_48px_-22px_rgba(0,0,0,0.55)]",
        aspect,
        className,
      )}
    >
      {present ? (
        <RealImage image={image} sizes={sizes} priority={priority} />
      ) : (
        <SlotPlaceholder image={image} />
      )}

      {/* Optional gradient mask treatment */}
      {image.mask && image.mask !== "none" && present && (
        <GradientMask mask={image.mask} />
      )}

      {/* Per-region redaction overlays */}
      {present &&
        image.blurZones?.map((zone, i) => <BlurOverlay key={i} zone={zone} />)}
    </div>
  );

  if (!image.caption) return frame;

  return (
    <figure className="flex flex-col gap-3">
      {frame}
      <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
        <span className="h-px w-4 bg-faint" />
        <span className="text-muted tracking-[0.04em] normal-case">
          {image.caption}
        </span>
      </figcaption>
    </figure>
  );
}

function RealImage({
  image,
  sizes,
  priority,
}: {
  image: EditorialImageRef;
  sizes: string;
  priority: boolean;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}

function GradientMask({
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

function BlurOverlay({ zone }: { zone: BlurZone }) {
  const intensity = zone.intensity ?? "soft";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute",
        intensity === "soft"
          ? "bg-charcoal-strong/30 backdrop-blur-md"
          : "bg-charcoal-strong/65 backdrop-blur-xl",
      )}
      style={{
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.w}%`,
        height: `${zone.h}%`,
      }}
    />
  );
}

function SlotPlaceholder({ image }: { image: EditorialImageRef }) {
  const filename = image.src.split("/").pop() ?? image.src;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-charcoal-strong p-6">
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-border-strong/60"
      />
      <div className="relative flex flex-col items-center gap-2 text-center">
        <span className="text-eyebrow text-[10px] text-accent">Slot</span>
        <span className="font-mono text-[11px] text-foreground/80">
          {filename}
        </span>
        <span className="max-w-[28ch] text-[11px] leading-snug text-muted">
          {image.slot}
        </span>
      </div>
    </div>
  );
}
