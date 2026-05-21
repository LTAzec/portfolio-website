import type { NavLink } from "@/lib/types";

/**
 * Primary navigation. Hrefs are in-page anchors because the portfolio
 * is a single long-scroll page; switch to real routes when detail pages exist.
 */
export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
