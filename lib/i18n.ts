import type { Locale } from "@/i18n/routing";

export type { Locale };

/**
 * Inline translation helpers for data files (e.g. `data/projects.ts`).
 *
 * `loc()` / `locArr()` return a value that is *typed* as a plain
 * `string` / `string[]`, so they slot straight into the existing
 * `Project` interfaces without widening a single field — but at runtime
 * they carry both languages as `{ en, nl }`. `resolveLocalizedDeep()`
 * later walks the object tree and swaps in the active locale.
 *
 * This keeps the data authoring ergonomic and the consuming components
 * completely untouched (they keep receiving plain strings), while any
 * field at any depth can become bilingual just by wrapping it.
 *
 *   title: loc("BoulderBuddy", "BoulderBuddy"),
 *   highlights: locArr(["…en…"], ["…nl…"]),
 */
type LocalizedMap<T> = { en: T; nl: T };

export function loc(en: string, nl: string): string {
  return { en, nl } as unknown as string;
}

export function locArr(en: string[], nl: string[]): string[] {
  return { en, nl } as unknown as string[];
}

function isLocalizedMap(value: unknown): value is LocalizedMap<unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value as object);
  return (
    keys.length > 0 &&
    keys.every((k) => k === "en" || k === "nl") &&
    "en" in (value as object)
  );
}

/**
 * Recursively resolves every `{ en, nl }` marker (produced by `loc` /
 * `locArr`) within a value to the active locale, leaving everything else
 * untouched. Falls back to English when a locale value is missing.
 */
export function resolveLocalizedDeep<T>(value: T, locale: Locale): T {
  if (Array.isArray(value)) {
    return value.map((item) => resolveLocalizedDeep(item, locale)) as unknown as T;
  }

  if (value && typeof value === "object") {
    if (isLocalizedMap(value)) {
      const map = value as LocalizedMap<unknown>;
      const picked = map[locale] ?? map.en;
      return resolveLocalizedDeep(picked, locale) as T;
    }

    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = resolveLocalizedDeep(val, locale);
    }
    return out as T;
  }

  return value;
}
