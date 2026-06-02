import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");

/**
 * Server-side check for whether an asset path under `/public` exists on
 * disk. Used by case-study components (EditorialImage, VideoPanel,
 * MediaStack, WorkflowSection, ProjectGallery) to decide whether to
 * render the real asset, a slot placeholder, or skip the section
 * entirely.
 *
 * Percent-encoded segments (e.g. `Installer%20tool`) are decoded before
 * the filesystem check so encoded URLs in data still resolve to their
 * raw filenames on disk.
 */
export function assetExists(src: string): boolean {
  if (!src) return false;
  try {
    const decoded = decodeURI(src);
    return fs.existsSync(path.join(publicDir, decoded.replace(/^\//, "")));
  } catch {
    return false;
  }
}
