/**
 * Public URL helpers for assets under `public/projects/<dir>/`.
 */

export const PROJECTS_PUBLIC_BASE = "/projects";

/** Maps portfolio slug → directory name under `public/projects/`. */
export const PROJECT_DIR_BY_SLUG: Record<string, string> = {
  "az-turnhout-tooling": "az-turnhout-tooling",
  jarvis: "jarvis",
  "jansen-car-detailing": "jansen-car-detailing",
  "bouldering-app": "bouldering-app",
};

/**
 * Build a public path: `/projects/<dir>/segment1/segment2/file.png`.
 * Encodes each segment for spaces and special characters.
 */
export function projectPublicPath(
  slug: string,
  ...segments: string[]
): string {
  const dir = PROJECT_DIR_BY_SLUG[slug] ?? slug;
  const parts = [PROJECTS_PUBLIC_BASE, dir, ...segments].filter(Boolean);
  return parts.map((segment) => encodeURI(segment)).join("/");
}
