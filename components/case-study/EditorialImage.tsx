import type * as React from "react";
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
  // Mockup framing — narrow centered portrait card. Defaults to
  // fit="contain" (letterbox a document/screenshot inside the frame),
  // but an explicit fit="cover" wins so a product screenshot can tight-
  // crop inside the same mockup card. Mask overlay is suppressed under
  // contain (mask + letterbox bars don't compose well).
  const isMockup = image.frame === "mockup";
  const isContain =
    image.fit === "contain" || (image.fit === undefined && isMockup);
  const aspect =
    image.aspect ?? (isMockup ? "aspect-[4/5]" : "aspect-[16/10]");
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
        <RealImage
          image={image}
          sizes={sizes}
          priority={priority}
          contain={isContain}
        />
      ) : (
        <SlotPlaceholder image={image} />
      )}

      {/* Optional gradient mask treatment — suppressed for contain/mockup */}
      {!isContain && image.mask && image.mask !== "none" && present && (
        <GradientMask mask={image.mask} />
      )}

      {/* Per-region redaction overlays */}
      {present &&
        image.blurZones?.map((zone, i) => <BlurOverlay key={i} zone={zone} />)}
    </div>
  );

  const inner = image.caption ? (
    <figure className="flex flex-col gap-3">
      {frame}
      <figcaption className="text-eyebrow flex items-center gap-2 text-[10px]">
        <span className="h-px w-4 bg-faint" />
        <span className="text-muted tracking-[0.04em] normal-case">
          {image.caption}
        </span>
      </figcaption>
    </figure>
  ) : (
    frame
  );

  // Mockup wraps the whole element in a narrow centered column.
  if (isMockup) {
    return <div className="mx-auto w-full max-w-[440px]">{inner}</div>;
  }
  return inner;
}

function RealImage({
  image,
  sizes,
  priority,
  contain,
}: {
  image: EditorialImageRef;
  sizes: string;
  priority: boolean;
  contain: boolean;
}) {
  // Optional crop refinement: objectPosition steers the visible region
  // under cover; zoom scales the image past its own padding so the UI
  // fills more of the frame. Both are no-ops when undefined.
  const style: React.CSSProperties = {};
  if (image.objectPosition) style.objectPosition = image.objectPosition;
  if (image.zoom && image.zoom !== 1) style.transform = `scale(${image.zoom})`;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={contain ? "object-contain" : "object-cover"}
      style={Object.keys(style).length > 0 ? style : undefined}
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
