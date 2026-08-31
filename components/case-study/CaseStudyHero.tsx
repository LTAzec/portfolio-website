import type { LongFormCaseStudy, Project } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { EditorialImage } from "./EditorialImage";
import { VideoPanel } from "./VideoPanel";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CaseStudyHeroProps {
  project: Project;
}

/**
 * Long-form case-study hero. Two compositions:
 *
 *  - "default" (existing behaviour): title slab → meta strip → full-width
 *    heroMedia frame, stacked vertically. Used by Jansen, AZ Turnhout etc.
 *  - "split" (opt-in via `longForm.heroLayout = "split"`): title slab is
 *    a 12-col grid with the title/tagline/CTA on the left (col-7) and
 *    the heroMedia inline on the right (col-5). The standalone hero
 *    media section is omitted in this mode. On mobile the grid collapses
 *    to a vertical stack — text first, then media — preserving the
 *    natural reading order.
 *
 * Mockup/aspect/fit treatments come from `EditorialImage`; this component
 * is only responsible for layout composition, not image rendering.
 */
export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const lf = project.caseStudy?.longForm;
  const status = statusLabel(project.status);
  const isSplit = lf?.heroLayout === "split";
  const heroMedia = lf?.heroMedia;

  return (
    <>
      {/* ── Editorial title slab ──────────────────────────────────── */}
      <section className="pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Container>
          {isSplit && heroMedia ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <TitleContent project={project} />
              </div>
              <div className="lg:col-span-5">
                <Reveal delay={100}>
                  <HeroMediaFrame heroMedia={heroMedia} sizes={SPLIT_MEDIA_SIZES} />
                </Reveal>
              </div>
            </div>
          ) : (
            <TitleContent project={project} />
          )}
        </Container>
      </section>

      {/* ── Meta strip ────────────────────────────────────────────── */}
      <section className="border-y border-border py-7">
        <Container>
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-x-8">
            <MetaItem label="Role" value={project.role ?? "—"} />
            <MetaItem label="Year" value={String(project.year)} />
            <MetaItem
              label="Stack"
              value={project.stack.slice(0, 3).join(" · ")}
            />
            <MetaItem label="Status" value={status} />
          </dl>

          {lf?.contextTags && lf.contextTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
              {lf.contextTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "text-eyebrow inline-flex items-center rounded-full border border-border bg-charcoal/60 px-3 py-1 text-[10px]",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Hero media frame — default layout only ────────────────── */}
      {!isSplit && heroMedia && (
        <section className="py-14 sm:py-20">
          <Container>
            <Reveal>
              <HeroMediaFrame heroMedia={heroMedia} sizes={DEFAULT_MEDIA_SIZES} />
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}

/* Sizes hints tuned per layout — split mode places media in a max-w-[440px]
   mockup wrapper inside a col-5 column, so the served image is much smaller
   than the default full-width hero frame. */
const SPLIT_MEDIA_SIZES =
  "(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw";
const DEFAULT_MEDIA_SIZES = "(min-width: 1024px) 1100px, 100vw";

/* ──────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────── */

function TitleContent({ project }: { project: Project }) {
  const t = useTranslations("common");

  return (
    <>
      <Reveal>
        <span className="text-eyebrow flex items-center gap-3">
          <span className="text-accent">Case study</span>
          <span className="h-px w-6 bg-faint" />
          <span>{project.year}</span>
          {project.status === "private" && (
            <>
              <span className="h-px w-6 bg-faint" />
              <span className="text-muted">Internal · Private</span>
            </>
          )}
        </span>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mt-6 text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-foreground sm:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.02]">
          {project.title}
        </h1>
      </Reveal>

      <Reveal delay={140}>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {project.tagline}
        </p>
      </Reveal>

      {project.links?.live && (
        <Reveal delay={200}>
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="ring-highlight group mt-7 inline-flex items-center gap-2.5 rounded-full border border-accent/35 bg-accent-soft px-5 py-2.5 text-[13px] font-medium tracking-[0.005em] text-accent shadow-[0_10px_30px_-14px_rgba(45,123,255,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/55 hover:bg-[rgba(45,123,255,0.16)] hover:text-foreground hover:shadow-[0_16px_38px_-12px_rgba(45,123,255,0.65),inset_0_1px_0_0_rgba(255,255,255,0.1)] sm:mt-8"
          >
            <span>{t("visitLiveSite")}</span>
            <span
              aria-hidden
              className="inline-flex items-center text-[14px] leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </Reveal>
      )}
    </>
  );
}

function HeroMediaFrame({
  heroMedia,
  sizes,
}: {
  heroMedia: NonNullable<LongFormCaseStudy["heroMedia"]>;
  sizes: string;
}) {
  if (heroMedia.kind === "image") {
    return <EditorialImage image={heroMedia.ref} sizes={sizes} priority />;
  }
  return (
    <VideoPanel
      src={heroMedia.src}
      poster={heroMedia.poster}
      alt={heroMedia.alt}
      caption={heroMedia.caption}
      aspect={heroMedia.aspect ?? "aspect-[16/9]"}
      fit={heroMedia.fit}
      zoom={heroMedia.zoom}
      objectPosition={heroMedia.objectPosition}
    />
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-eyebrow text-[10px]">{label}</dt>
      <dd className="text-[13px] text-foreground">{value}</dd>
    </div>
  );
}

function statusLabel(status: Project["status"]): string {
  const map: Record<Project["status"], string> = {
    live: "Live",
    "in-progress": "In progress",
    private: "Private",
    concept: "Concept",
  };
  return map[status];
}
