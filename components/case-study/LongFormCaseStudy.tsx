import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Tag } from "@/components/ui/Tag";
import { assetExists } from "@/lib/asset-utils";
import {
  discoverInternalProjectMedia,
  discoverMediaFolder,
} from "@/lib/discover-internal-project-media";
import { resolveProjectHeroMedia } from "@/lib/resolve-project-media";
import { CaseStudyHero } from "./CaseStudyHero";
import { EditorialSection, EditorialProse } from "./EditorialSection";
import { MediaStack } from "./MediaStack";
import { WorkflowSection } from "./WorkflowSection";
import { EngineeringApproachGrid } from "./EngineeringApproachGrid";
import { ProjectGallery } from "./ProjectGallery";
import { MediaShowcase } from "./MediaShowcase";
import { MetricsRail } from "./MetricsRail";
import {
  InternalProjectsShowcase,
  type InternalProjectWithMedia,
} from "./InternalProjectsShowcase";
import { Reveal } from "./Reveal";

interface LongFormCaseStudyProps {
  project: Project;
  nextProject?: Project;
}

/**
 * Editorial long-form case study renderer.
 */
export function LongFormCaseStudy({
  project,
  nextProject,
}: LongFormCaseStudyProps) {
  const t = useTranslations("common");
  const lf = project.caseStudy?.longForm;
  if (!lf) return null;

  const problemMediaAvailable = lf.problemDetail.media.some((img) =>
    assetExists(img.src),
  );

  // Server-side: enrich each declared internal project with the media files
  // currently sitting in its folder. The client tab navigator just renders
  // what it receives.
  const internalProjects: InternalProjectWithMedia[] = (
    lf.internalProjects ?? []
  ).map((p) => ({
    ...p,
    discoveredMedia: discoverInternalProjectMedia(p),
  }));

  // Resolve the hero media via the shared helper.
  const heroProject = resolveProjectHeroMedia(project);

  // For single-folder long-form studies (Jansen / future client work):
  // auto-discover media from lf.mediaDir so the same drop-files-and-go
  // workflow applies. Falls back to legacy WorkflowSection + ProjectGallery
  // when neither internalProjects nor mediaDir is configured.
  //
  // After discovery: if heroMedia is set and points at a file that also
  // lives in mediaDir, filter that file out of the showcase — but ONLY
  // when the hero uses the default full-width media frame (where the same
  // image as the showcase primary would be a literal duplicate). Under
  // heroLayout="split" the hero shows a compact product mockup beside
  // the title; the same screenshot then legitimately also appears in the
  // showcase as part of the user-flow sequence (e.g. form → output 1 →
  // output 2) and we want to keep it.
  let mediaShowcaseMedia =
    !lf.internalProjects?.length && lf.mediaDir
      ? discoverMediaFolder(lf.mediaDir, lf.mediaOverrides, lf.mediaOrder)
      : null;
  if (
    mediaShowcaseMedia &&
    lf.heroMedia &&
    lf.heroLayout !== "split"
  ) {
    const heroSrc =
      lf.heroMedia.kind === "video"
        ? lf.heroMedia.src
        : lf.heroMedia.ref.src;
    mediaShowcaseMedia = {
      images: mediaShowcaseMedia.images.filter((i) => i.src !== heroSrc),
      videos: mediaShowcaseMedia.videos.filter((v) => v.src !== heroSrc),
    };
  }

  // Per-section label overrides — let each project frame its own narrative.
  const lbl = lf.sectionLabels ?? {};
  const labels = {
    problemEyebrow: lbl.problem?.eyebrow ?? "The problem",
    toolingEyebrow: lbl.tooling?.eyebrow ?? "Tooling",
    toolingHeading: lbl.tooling?.heading ?? "What was actually built",
    toolingDescription:
      lbl.tooling?.description ??
      "Each module is a single workflow with its own UI, its own permissions, and a strict data contract on the SQL Server back-end.",
    engineeringEyebrow: lbl.engineering?.eyebrow ?? "Engineering",
    engineeringHeading: lbl.engineering?.heading ?? "How it holds up",
    engineeringDescription:
      lbl.engineering?.description ??
      "The non-glamourous parts of internal hospital software — auditability, idempotency, data migration discipline.",
    showcaseEyebrow: lbl.showcase?.eyebrow ?? "Showcase",
    showcaseHeading: lbl.showcase?.heading ?? "The system in motion",
    showcaseDescription:
      lbl.showcase?.description ??
      "Real screens and recordings from the running tooling. Sensitive identifiers are redacted; the UI and data flow are otherwise untouched.",
    resultsEyebrow: lbl.results?.eyebrow ?? "Outcome",
    resultsHeading: lbl.results?.heading ?? "What changed",
    closingEyebrow: lbl.closing?.eyebrow ?? "Note",
  };

  return (
    <article>
      {/* ── Top back link ─────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32">
        <Container>
          <Link
            href="/projects"
            className="text-eyebrow group inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              ←
            </span>
            {t("backToProjects")}
          </Link>
        </Container>
      </section>

      {/* ── Hero + meta strip + hero media ────────────────────────── */}
      <CaseStudyHero project={heroProject} />

      {/* ── 2. Context ────────────────────────────────────────────── */}
      <EditorialSection
        eyebrow={t("contextEyebrow")}
        heading={t("contextHeading")}
      >
        <EditorialProse paragraphs={lf.context} />
      </EditorialSection>

      {/* ── 3. Problem detail ─────────────────────────────────────── */}
      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <Reveal>
            <span className="text-eyebrow">{labels.problemEyebrow}</span>
          </Reveal>
          <div
            className={
              problemMediaAvailable
                ? "mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
                : "mt-8"
            }
          >
            <div className={problemMediaAvailable ? "lg:col-span-6" : ""}>
              <Reveal delay={60}>
                <EditorialProse paragraphs={lf.problemDetail.paragraphs} />
              </Reveal>
            </div>
            {problemMediaAvailable && (
              <div className="lg:col-span-6">
                <MediaStack
                  images={lf.problemDetail.media}
                  primary="right"
                  hideIfMissing
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── 4. Multi-project tabs OR single-folder MediaShowcase OR legacy ─ */}
      {internalProjects.length > 0 ? (
        <InternalProjectsShowcase projects={internalProjects} />
      ) : mediaShowcaseMedia ? (
        <>
          {lf.tooling.length > 0 && (
            <WorkflowSection
              eyebrow={labels.toolingEyebrow}
              heading={labels.toolingHeading}
              description={labels.toolingDescription}
              modules={lf.tooling}
            />
          )}
          <MediaShowcase
            media={mediaShowcaseMedia}
            eyebrow={labels.showcaseEyebrow}
            heading={labels.showcaseHeading}
            description={labels.showcaseDescription}
            variant={lf.showcaseLayout}
          />
        </>
      ) : (
        <>
          <WorkflowSection
            eyebrow={labels.toolingEyebrow}
            heading={labels.toolingHeading}
            description={labels.toolingDescription}
            modules={lf.tooling}
          />
          <ProjectGallery
            eyebrow={labels.showcaseEyebrow}
            heading={labels.showcaseHeading}
            description={labels.showcaseDescription}
            items={lf.showcase}
          />
        </>
      )}

      {/* ── 5. Engineering approach ───────────────────────────────── */}
      <EngineeringApproachGrid
        eyebrow={labels.engineeringEyebrow}
        heading={labels.engineeringHeading}
        description={labels.engineeringDescription}
        cards={lf.engineering}
      />

      {/* ── 6. Results ────────────────────────────────────────────── */}
      <EditorialSection eyebrow={labels.resultsEyebrow} heading={labels.resultsHeading}>
        <EditorialProse paragraphs={lf.results.paragraphs} />
        {lf.results.metrics && lf.results.metrics.length > 0 && (
          <div className="mt-10">
            <MetricsRail metrics={lf.results.metrics} />
          </div>
        )}
      </EditorialSection>

      {/* ── Built with ────────────────────────────────────────────── */}
      <section className="border-b border-border py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="text-eyebrow">Built with</span>
              </div>
              <div className="lg:col-span-8">
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Closing block ─────────────────────────────────────────── */}
      <section className="border-b border-border py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="text-eyebrow">{labels.closingEyebrow}</span>
              </div>
              <div className="lg:col-span-8">
                <EditorialProse paragraphs={lf.closing} />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Next project ──────────────────────────────────────────── */}
      {nextProject && (
        <section className="py-16 sm:py-24">
          <Container>
            <span className="text-eyebrow">{t("nextCase")}</span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="ring-highlight group mt-5 flex flex-col gap-6 rounded-xl border border-border bg-charcoal/60 p-6 transition-colors hover:border-border-strong hover:bg-charcoal-strong/70 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            >
              <div>
                <div className="text-eyebrow text-[10px]">
                  <span className="text-accent">{nextProject.stack[0]}</span>
                  <span className="mx-1.5 text-faint">·</span>
                  <span>{nextProject.year}</span>
                </div>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {nextProject.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  {nextProject.tagline}
                </p>
              </div>
              <span
                aria-hidden
                className="font-mono text-2xl text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </Link>
          </Container>
        </section>
      )}

      {/* ── Bottom back link ──────────────────────────────────────── */}
      <section className="border-t border-border py-14 sm:py-20">
        <Container>
          <Link
            href="/projects"
            className="text-eyebrow group inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              ↑
            </span>
            {t("backToAllProjects")}
          </Link>
        </Container>
      </section>
    </article>
  );
}
