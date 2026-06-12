import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation APIs. Use these `Link` / `useRouter` /
 * `usePathname` everywhere instead of the ones from `next/link` and
 * `next/navigation` so that the active locale prefix is handled
 * automatically (and switching locale keeps you on the same page).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
