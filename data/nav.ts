import type { NavLink } from "@/lib/types";

/**
 * Primary navigation — real page routes (not anchors) so the navbar
 * works as a multi-page site, not a single scroll.
 */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
