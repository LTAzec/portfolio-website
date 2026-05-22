import type { SocialLink } from "@/lib/types";

export const site = {
  name: "AZEC Digital",
  founder: "Yannis Bertels",
  brand: "AZEC Digital",
  role: "Independent digital studio",
  location: "Belgium",
  tagline: "AZEC Digital",
  description:
    "A portfolio of digital products, interfaces, tooling and AI-driven experiments — built with clarity, usability and clean execution.",
  email: "yannisbertels@gmail.com",
  availability: "Available for new projects",
  founded: 2025,
  url: "https://azec.digital",
} as const;

export const socials: SocialLink[] = [
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
  { label: "GitHub", href: "https://github.com/", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
];
