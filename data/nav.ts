/**
 * Primary navigation — real page routes (not anchors) so the navbar works
 * as a multi-page site, not a single scroll.
 *
 * `key` maps to the `nav.*` namespace in messages/{en,nl}.json; labels are
 * resolved at render time so the menu is translated. Hrefs are passed
 * through next-intl's locale-aware <Link>, which adds the `/nl` prefix when
 * needed.
 */
export interface NavItem {
  key: "home" | "projects" | "about" | "contact";
  href: string;
}

export const navItems: NavItem[] = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];
