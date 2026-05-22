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
  if (project.media) {
    return <MediaInner media={project.media} aspect={aspect} className={className} sizes={sizes} title={project.title} />;
  }
  return <Placeholder project={project} index={index} aspect={aspect} className={className} />;
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
          className="h-full w-full object-cover"
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
