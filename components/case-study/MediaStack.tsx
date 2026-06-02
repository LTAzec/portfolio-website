import type { EditorialImageRef } from "@/lib/types";
import { assetExists } from "@/lib/asset-utils";
import { EditorialImage } from "./EditorialImage";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface MediaStackProps {
  /** First entry is the primary (larger) image; the rest are secondaries. */
  images: EditorialImageRef[];
  /** Layout direction — primary lives on the right by default. */
  primary?: "left" | "right";
  className?: string;
  /** When true, images whose source file isn't on disk are filtered out
   *  before layout — the stack collapses cleanly to whatever is present
   *  (or to null when every image is missing). */
  hideIfMissing?: boolean;
}

/**
 * Asymmetric two-column image composition:
 *
 *   ┌───────────┬─────────────────┐
 *   │ secondary │                 │
 *   │  (top)    │     primary     │
 *   ├───────────┤   (full col)    │
 *   │ secondary │                 │
 *   │ (bottom)  │                 │
 *   └───────────┴─────────────────┘
 *
 * Works with 1, 2, or 3 images. Single-image case collapses to a centred
 * frame; the staggered grid only kicks in from `md:` upward.
 */
export function MediaStack({
  images,
  primary = "right",
  className,
  hideIfMissing = false,
}: MediaStackProps) {
  // Filter to present-on-disk images when collapse mode is on.
  const effective = hideIfMissing
    ? images.filter((img) => assetExists(img.src))
    : images;

  if (effective.length === 0) return null;

  if (effective.length === 1) {
    return (
      <Reveal className={className}>
        <EditorialImage
          image={effective[0]}
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </Reveal>
    );
  }

  const [first, ...rest] = effective;
  const secondaries = rest.slice(0, 2);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6",
        className,
      )}
    >
      <Reveal
        className={cn(
          "md:col-span-7",
          primary === "left" ? "md:order-1" : "md:order-2",
        )}
      >
        <EditorialImage
          image={first}
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      </Reveal>

      <div
        className={cn(
          "flex flex-col gap-5 md:col-span-5 md:gap-6",
          primary === "left" ? "md:order-2" : "md:order-1",
        )}
      >
        {secondaries.map((img, i) => (
          <Reveal key={img.src + i} delay={i * 80}>
            <EditorialImage
              image={img}
              sizes="(min-width: 1024px) 35vw, 100vw"
              className={img.aspect ? undefined : "aspect-[4/3]"}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
