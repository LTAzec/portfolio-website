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
    | { kind: "video"; src: string; poster?: string; alt: string; caption?: string };
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
