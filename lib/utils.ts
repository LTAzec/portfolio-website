/**
 * Tiny class-name joiner. Keeps the dependency surface zero while giving
 * us the same ergonomics as `clsx` for the small set of cases we need.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
