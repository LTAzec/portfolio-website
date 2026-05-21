import type { SocialLink } from "@/lib/types";

/**
 * Single source of truth for AZEC Digital's brand metadata.
 * AZEC Digital is the studio identity; Yannis (the founder) surfaces
 * personally in About and Contact only.
 */
export const site = {
  name: "AZEC Digital",
  founder: "Yannis Bertels",
  brand: "AZEC Digital",
  role: "Independent digital studio",
  location: "Belgium",
  /** Hero headline — now intentionally just the brand. */
  tagline: "AZEC Digital",
  /** Long-form description used for the hero subline and SEO. */
  description:
    "A portfolio of digital products, interfaces, tooling and AI-driven experiments — built with clarity, usability and clean execution.",
  email: "yannisbertels@gmail.com",
  availability: "Available for new projects",
  founded: 2025,
  url: "https://azec.digital",
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
];
