/**
 * Shared domain types. Keeping all data-shape definitions here means
 * the `data/` modules and the components that consume them stay aligned.
 */

export type ProjectStatus = "live" | "in-progress" | "private" | "concept";

export interface ProjectLinks {
  live?: string;
  repo?: string;
  case?: string;
}

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
  /** Optional subtle label rendered under the tile in card layouts that
   *  support it (e.g. cardMediaLayout="stacked-platforms"). */
  label?: string;
  /** CSS object-position for fine-tuning the visible crop under cover. */
  objectPosition?: string;
  /** CSS scale factor applied via transform — lets a video zoom past
   *  its own letterbox edges when the source aspect doesn't exactly
   *  match the frame. Typical values 1.02 – 1.08. */
  zoom?: number;
}

/* ──────────────────────────────────────────────────────────────
   Long-form case study primitives
   Used by the AZ Turnhout study and any future deep-dive project.
   ────────────────────────────────────────────────────────────── */

/** Local redaction overlay on an editorial image — percentages of the frame. */
export interface BlurZone {
  x: number;
  y: number;
  w: number;
  h: number;
  /** soft = subtle gaussian, strong = fully obscure. */
  intensity?: "soft" | "strong";
}

/** A single screenshot or visual slot inside the case study. */
export interface EditorialImageRef {
  /** Path under /public. Set even when the file is not yet on disk — the
   *  EditorialImage component renders a labelled placeholder until it is. */
  src: string;
  /** Short label shown in the placeholder card while the file is missing. */
  slot: string;
  /** Accessibility text. */
  alt: string;
  /** Optional small mono caption rendered under the frame. */
  caption?: string;
  /** Extra redaction layered on top of whatever blur the asset already has. */
  blurZones?: BlurZone[];
  /** Gradient mask treatment to soften unreadable detail at edges. */
  mask?: "fade-bottom" | "fade-top" | "fade-edges" | "none";
  /** Tailwind aspect class for the frame. */
  aspect?: string;
  /** Image fit treatment inside its frame. Defaults to "cover" — crops
   *  to fill the frame, ideal for product screenshots and photography.
   *  Use "contain" for long-form text screenshots or document-style
   *  captures where the full content needs to remain readable (the
   *  letterbox bars become the frame background, no cropping). */
  fit?: "cover" | "contain";
  /** Frame presentation style. "default" renders full-width within its
   *  container. "mockup" presents as a narrow, centered portrait card —
   *  used for mobile/document-style screenshots that shouldn't stretch to
   *  full-bleed. Defaults fit to "contain"; pass an explicit fit="cover"
   *  to tightly crop an app/product screenshot inside the mockup frame. */
  frame?: "default" | "mockup";
  /** CSS object-position for fine-tuning the visible crop region under
   *  fit="cover". e.g. "center top" or "center 30%". */
  objectPosition?: string;
  /** CSS scale factor applied via transform — lets a cover-fit screenshot
   *  zoom past its own empty padding so the actual UI fills more of the
   *  frame. Values typically 1.1 – 1.6; 1 (or undefined) is no scaling. */
  zoom?: number;
  /** Optional display label rendered above the media tile in layouts that
   *  support it (e.g. MediaShowcase platform-split). Used to identify a
   *  surface — "Admin / Backend", "Mobile App", etc. */
  label?: string;
  /** Native dimensions used by next/image when src exists. */
  width?: number;
  height?: number;
}

export interface ToolingModule {
  /** Mono eyebrow, e.g. "01 · Bereidings-logboek". */
  eyebrow: string;
  /** Short human title. */
  title: string;
  /** 1–3 line description. */
  description: string;
  /** Optional visual reference. */
  media?: EditorialImageRef;
}

export interface EngineeringCard {
  /** Mono numeral, e.g. "01". */
  index: string;
  title: string;
  body: string;
}

export interface ShowcaseItem {
  /** `stack` renders an asymmetric MediaStack; `single` a centred frame; `video` an autoplay loop. */
  variant: "stack" | "single" | "video";
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** Images used when variant is stack/single. First entry is treated as the primary. */
  media?: EditorialImageRef[];
  /** Video source when variant is video. */
  video?: { src: string; poster?: string; alt: string; caption?: string };
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  detail?: string;
}

/** A single internal application inside a multi-project showcase
 *  (e.g. AZ Turnhout contains 4 distinct internal apps). The case study
 *  page renders these via the InternalProjectsShowcase tab navigator. */
export interface InternalProject {
  /** Stable id used as React key and tab anchor. */
  id: string;
  /** Mono numeral shown in the tab strip, e.g. "01". */
  index: string;
  /** Human name shown in the tab, e.g. "Voorraadbeheer". */
  name: string;
  /** Short one-line subtitle under the heading. */
  tagline: string;
  /** Display status badge (free text, e.g. "Live · Internal"). */
  status?: string;
  /** 1-2 paragraphs of context / problem. */
  context: string[];
  /** 1-2 paragraphs explaining what was actually built. */
  built: string[];
  /** Technical stack chips. */
  stack: string[];
  /** Concise results / impact lines. */
  results: string[];
  /** Public path to the project's media directory. Files dropped into
   *  this folder are auto-discovered at render time. */
  mediaDir?: string;
  /** Optional explicit overrides — keyed by filename — for blur zones,
   *  masks or captions that auto-discovery can't infer. */
  mediaOverrides?: Record<string, Partial<EditorialImageRef>>;
}

export interface LongFormCaseStudy {
  /** Optional extra meta-rail tags alongside Role / Year / Stack / Status. */
  contextTags?: string[];
  /** Hero media — large frame above the meta strip. */
  heroMedia?:
    | { kind: "image"; ref: EditorialImageRef }
    | {
        kind: "video";
        src: string;
        poster?: string;
        alt: string;
        caption?: string;
        /** Tailwind aspect class for the frame. Defaults to 16/9. */
        aspect?: string;
        /** Video fit inside its frame. "cover" (default) crops to fill;
         *  "contain" shows the whole video in its native aspect with no
         *  crop and no baseline scale — the frame hugs the video. */
        fit?: "cover" | "contain";
        /** CSS object-position for fine-tuning the visible crop. */
        objectPosition?: string;
        /** CSS scale factor for cropping past source-video letterbox edges. */
        zoom?: number;
      };
  /** Hero composition. "default" stacks the title slab, meta strip and a
   *  full-width heroMedia frame vertically. "split" places heroMedia
   *  beside the title text on desktop (text col-7 + media col-5) and
   *  collapses to a vertical stack on mobile. Use "split" for product/
   *  SaaS-style heroes where the screenshot belongs visually inside the
   *  hero, not below it. */
  heroLayout?: "default" | "split";
  /** MediaShowcase layout. "default" = primary tile + secondary 2-col
   *  grid (Jansen-style). "platform-split" = 2-tile asymmetric grid
   *  (lg:col-span-2 + lg:col-span-1) with optional labels above each
   *  tile — used to present a wide surface (admin/web) next to a narrow
   *  surface (mobile) for full-stack platform case studies. Both tiles
   *  keep their native aspect via per-media aspect overrides. */
  showcaseLayout?: "default" | "platform-split";
  /** Section 2 — context paragraphs. */
  context: string[];
  /** Section 3 — problem detail (copy left, supporting visuals right). */
  problemDetail: {
    paragraphs: string[];
    media: EditorialImageRef[];
  };
  /** Section 4 — tooling modules grid. */
  tooling: ToolingModule[];
  /** Section 5 — engineering approach cards. */
  engineering: EngineeringCard[];
  /** Section 6 — asymmetric visual showcase. */
  showcase: ShowcaseItem[];
  /** Section 7 — results paragraphs + optional metrics rail. */
  results: {
    paragraphs: string[];
    metrics?: CaseStudyMetric[];
  };
  /** Section 8 — closing block. */
  closing: string[];
  /** Optional project-wide media folder. When set (and no internalProjects),
   *  the renderer auto-discovers files and renders a non-tabbed
   *  MediaShowcase. Used by single-folder case studies (Jansen / future
   *  client work). */
  mediaDir?: string;
  /** Optional explicit overrides for the auto-discovered media — keyed by
   *  bare filename or relative path under mediaDir. */
  mediaOverrides?: Record<string, Partial<EditorialImageRef>>;
  /** Optional explicit ordering for the auto-discovered media — listed
   *  filenames come first in the given order; unlisted files fall back to
   *  alphabetical sort. Use when the natural filename sort doesn't match the
   *  desired narrative sequence and renaming the files isn't an option. */
  mediaOrder?: string[];
  /** Optional per-section label overrides. Lets each project frame its own
   *  sections — e.g. Jansen reads "Design direction" / "Service catalog" /
   *  "Performance" instead of AZ Turnhout's "The problem" / "Tooling" /
   *  "Engineering". */
  sectionLabels?: {
    problem?: { eyebrow?: string };
    tooling?: { eyebrow?: string; heading?: string; description?: string };
    engineering?: { eyebrow?: string; heading?: string; description?: string };
    showcase?: { eyebrow?: string; heading?: string; description?: string };
    results?: { eyebrow?: string; heading?: string };
    closing?: { eyebrow?: string };
  };
  /** Optional multi-project showcase. When present, the case study page
   *  renders a tab navigator over these internal projects in place of
   *  the generic Tooling + Visual Showcase sections. */
  internalProjects?: InternalProject[];
}

/** Ambient loop used on basic case-study pages (reuses VideoPanel styling). */
export interface CaseStudyVideoRef {
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  aspect?: string;
  /** CSS object-position for fine-tuning the visible crop under cover. */
  objectPosition?: string;
  /** CSS scale factor applied via transform — same semantics as on
   *  ProjectMedia. Default VideoPanel/VideoTile scale is 1.02; pass a
   *  higher value (e.g. 1.05) to crop past source-video letterbox edges. */
  zoom?: number;
  /** Optional display label rendered above the video tile in layouts that
   *  support it (e.g. MediaShowcase platform-split). Used to identify a
   *  surface — "Admin / Backend", "Mobile App", etc. */
  label?: string;
}

export interface ProjectCaseStudy {
  overview: string;
  problem: string;
  solution: string;
  result: string;
  /** Extra stills below the hero on basic case-study pages. */
  gallery?: EditorialImageRef[];
  /** Extra loops below the hero on basic case-study pages. */
  galleryVideos?: CaseStudyVideoRef[];
  /** When present, the [slug] route renders <LongFormCaseStudy /> instead of the basic layout. */
  longForm?: LongFormCaseStudy;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  role?: string;
  year: number;
  stack: string[];
  highlights?: string[];
  status: ProjectStatus;
  featured: boolean;
  links?: ProjectLinks;
  image?: string;
  accent?: "cyan" | "blue" | "violet";
  media?: ProjectMedia;
  /** Opt-in card media layout. Default (undefined) renders the single
   *  `media` tile exactly as before. "split-platforms" places the primary
   *  `media` (wide backend/admin loop, ~72%) beside `cardMediaSecondary`
   *  (narrow mobile loop, ~28%), both shown uncropped in their native
   *  ratio — used by full-stack projects that have two surfaces. */
  cardMediaLayout?: "split-platforms";
  /** Secondary card media — the narrow right tile under
   *  cardMediaLayout="split-platforms" (e.g. the mobile app loop). */
  cardMediaSecondary?: ProjectMedia;
  caseStudy?: ProjectCaseStudy;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "x";
}

/** Capability category used by the Capabilities section and About page. */
export interface Capability {
  title: string;
  description: string;
  items: string[];
}

/** Timeline entry used by the About page's experience/education timeline. */
export interface TimelineItem {
  year: string;
  title: string;
  meta?: string;
  description?: string;
  /** Multi-paragraph body. Used by BackgroundSection's featured entry; the
   *  basic Timeline component falls back to `description`. */
  body?: string[];
  /** Short mono label, e.g. "Software" / "Support" / "Coaching". */
  category?: string;
  /** When true, BackgroundSection promotes this entry to the featured slot
   *  with a richer layout. Ignored by the basic Timeline component. */
  featured?: boolean;
  type: "work" | "education" | "studio" | "milestone";
}
