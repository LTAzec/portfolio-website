import { Container } from "@/components/layout/Container";
import type { CaseStudyVideoRef, EditorialImageRef } from "@/lib/types";
import { assetExists } from "@/lib/asset-utils";
import { MediaStack } from "./MediaStack";
import { VideoPanel } from "./VideoPanel";
import { Reveal } from "./Reveal";

interface CaseStudyVisualsProps {
  images?: EditorialImageRef[];
  videos?: CaseStudyVideoRef[];
}

/**
 * Optional visual block for basic case studies — reuses long-form MediaStack
 * and VideoPanel without introducing a new gallery UI.
 */
export function CaseStudyVisuals({ images = [], videos = [] }: CaseStudyVisualsProps) {
  const presentVideos = videos.filter((v) => assetExists(v.src));
  const hasImages = images.some((img) => assetExists(img.src));

  if (!hasImages && presentVideos.length === 0) return null;

  return (
    <section className="border-b border-border py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="text-eyebrow">Visuals</span>
        </Reveal>

        {hasImages && (
          <div className="mt-8">
            <MediaStack images={images} hideIfMissing />
          </div>
        )}

        {presentVideos.length > 0 && (
          <div className="mt-8 flex flex-col gap-8">
            {presentVideos.map((video) => (
              <Reveal key={video.src}>
                <VideoPanel
                  src={video.src}
                  poster={video.poster}
                  alt={video.alt}
                  caption={video.caption}
                  aspect={video.aspect ?? "aspect-[16/10]"}
                  hideIfMissing
                />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
