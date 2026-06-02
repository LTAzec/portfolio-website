import type { ShowcaseItem } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { assetExists } from "@/lib/asset-utils";
import { EditorialImage } from "./EditorialImage";
import { MediaStack } from "./MediaStack";
import { VideoPanel } from "./VideoPanel";
import { Reveal } from "./Reveal";

interface ProjectGalleryProps {
  eyebrow: string;
  heading: string;
  description?: string;
  items: ShowcaseItem[];
}

/**
 * Section 6 — Visual Showcase.
 *
 * Heterogeneous list of showcase items. Each item is its own composition
 * (stack / single / video) with an editorial copy rail on the side. The
 * primary side alternates per item to keep the rhythm asymmetric without
 * tipping into chaos.
 *
 * Items whose underlying assets aren't on disk yet are filtered out — a
 * showcase row without a visual is a placeholder card, which is exactly
 * the production-feel we don't want. When all items are missing, the
 * whole section is rendered as a small editorial "embargoed" note so the
 * reader understands the gap is deliberate.
 */
export function ProjectGallery({
  eyebrow,
  heading,
  description,
  items,
}: ProjectGalleryProps) {
  const visibleItems = items.filter(itemHasPresentAsset);

  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <Reveal>
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
        </Reveal>

        {visibleItems.length === 0 ? (
          <Reveal>
            <div className="ring-highlight mt-14 rounded-xl border border-dashed border-border-strong/60 bg-charcoal/40 p-8 sm:p-10">
              <p className="max-w-2xl text-pretty text-[14.5px] leading-[1.65] text-muted">
                Additional visuals are being prepared for release. The case
                study covers the engineering surface in detail above; the
                screenshots and recordings will land here once they have
                passed an internal review for sensitive identifiers.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 flex flex-col gap-16 sm:mt-18 sm:gap-20">
            {visibleItems.map((item, i) => (
              <ShowcaseRow key={i} item={item} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function itemHasPresentAsset(item: ShowcaseItem): boolean {
  if (item.variant === "video") {
    return Boolean(item.video?.src && assetExists(item.video.src));
  }
  if (!item.media || item.media.length === 0) return false;
  // For stack/single, require at least the primary (first) image present.
  return assetExists(item.media[0].src);
}

function ShowcaseRow({ item, index }: { item: ShowcaseItem; index: number }) {
  const reversed = index % 2 === 1;

  const copyRail = (
    <Reveal className={reversed ? "lg:order-2" : "lg:order-1"}>
      <div className="flex flex-col gap-4 lg:max-w-sm">
        {item.eyebrow && (
          <span className="text-eyebrow text-[10px]">{item.eyebrow}</span>
        )}
        {item.heading && (
          <h3 className="text-balance text-[1.375rem] font-medium leading-[1.2] tracking-[-0.015em] text-foreground sm:text-[1.5rem]">
            {item.heading}
          </h3>
        )}
        {item.body && (
          <p className="text-pretty text-[14.5px] leading-[1.65] text-muted sm:text-[15px]">
            {item.body}
          </p>
        )}
      </div>
    </Reveal>
  );

  const mediaRail = (
    <div className={reversed ? "lg:order-1" : "lg:order-2"}>
      {item.variant === "video" && item.video ? (
        <VideoPanel
          src={item.video.src}
          poster={item.video.poster}
          alt={item.video.alt}
          caption={item.video.caption}
          hideIfMissing
        />
      ) : item.variant === "stack" && item.media && item.media.length > 0 ? (
        <MediaStack
          images={item.media}
          primary={reversed ? "left" : "right"}
          hideIfMissing
        />
      ) : item.variant === "single" && item.media && item.media.length > 0 ? (
        <Reveal>
          <EditorialImage
            image={item.media[0]}
            sizes="(min-width: 1024px) 65vw, 100vw"
            hideIfMissing
          />
        </Reveal>
      ) : null}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="lg:col-span-4">{copyRail}</div>
      <div className="lg:col-span-8">{mediaRail}</div>
    </div>
  );
}
