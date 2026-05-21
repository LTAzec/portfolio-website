import type { SocialLink } from "@/lib/types";

/**
 * Single source of truth for AZEC Digital's brand metadata.
 * The primary identity across the site is the studio (AZEC Digital);
 * Yannis appears personally in About and Contact only.
 */
export const site = {
  /** Primary identity used in navigation, SEO, OG. */
  name: "AZEC Digital",
  /** Founder — surfaces in About / Contact, not in the hero. */
  founder: "Yannis Bertels",
  /** Short brand label used where the wordmark can't render. */
  brand: "AZEC Digital",
  /** Studio role/positioning. */
  role: "Independent digital studio",
  location: "Belgium",
  /** Positioning headline (also used by SEO description fallback). */
  tagline:
    "Building clean software, modern interfaces and practical internal tooling.",
  /** Long-form description used for the hero subline and SEO. */
  description:
    "An independent studio building software, interfaces and tooling for product teams. Clean execution, shipped end-to-end.",
  email: "yannisbertels@gmail.com",
  availability: "Available for new projects",
  /** Studio founded year, displayed in editorial meta strips. */
  founded: 2025,
  url: "https://azec.digital",
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
];
