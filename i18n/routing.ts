import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing configuration.
 *
 *  - English is the default locale and stays prefix-free (`/`, `/projects`).
 *  - Dutch is served under a `/nl` prefix (`/nl`, `/nl/projects/...`).
 *
 * `localePrefix: "as-needed"` is what keeps the English URLs clean while
 * still giving Dutch its own crawlable, shareable, SEO-friendly paths.
 */
export const routing = defineRouting({
  locales: ["en", "nl"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
