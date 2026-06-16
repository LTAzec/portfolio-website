/**
 * Shared active-route logic for <Navbar /> and <MobileNav />.
 *
 * The pathname coming from next-intl's `usePathname()` is already locale-
 * stripped — `/projects/aria` on both `/projects/aria` and `/nl/projects/aria`
 * — so a simple prefix match against the nav item href works for both
 * languages.
 *
 * Rules:
 *  - "/" only matches the exact root (otherwise it would highlight Home on
 *    every route, since every pathname starts with "/").
 *  - Any other href matches when pathname equals it OR is a sub-path
 *    ("/projects" stays active on "/projects/aria").
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
