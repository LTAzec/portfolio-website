import fs from "fs";
import path from "path";
import type {
  CaseStudyVideoRef,
  EditorialImageRef,
  InternalProject,
} from "@/lib/types";

const publicDir = path.join(process.cwd(), "public");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

export interface DiscoveredMedia {
  images: EditorialImageRef[];
  videos: CaseStudyVideoRef[];
}

/**
 * Recursively scan an internal project's media folder. Any supported
 * image or video file — at any depth — becomes a ready-to-render entry.
 *
 * Behaviour:
 *   - Reads from `project.mediaDir` (a public URL path, possibly with
 *     `%20` etc. baked in). Decoded for the filesystem walk; re-encoded
 *     segment-by-segment for the generated public URL so spaces /
 *     capitals survive the browser request.
 *   - Recursive: a sub-folder like `voorraadbeheer/screenshots/` is
 *     fully walked. Useful when the user later organises media into
 *     `screenshots/`, `videos/`, etc.
 *   - Sorted by full relative path — so a `01-…/02-…` naming convention
 *     directly controls the visual sequence.
 *   - Optional `project.mediaOverrides` (keyed by file basename) lets
 *     the data file inject blur zones / masks / captions that
 *     auto-discovery cannot infer.
 *
 * Returns empty arrays when the folder is missing — the showcase
 * component will render a "Media pending" notice instead.
 */
export function discoverInternalProjectMedia(
  project: InternalProject,
): DiscoveredMedia {
  const dir = project.mediaDir;
  if (!dir) return { images: [], videos: [] };

  const decodedDir = decodeURI(dir);
  const fullPath = path.join(publicDir, decodedDir.replace(/^\//, ""));

  if (!safeExists(fullPath)) return { images: [], videos: [] };

  const files = walk(fullPath, fullPath);

  const images: EditorialImageRef[] = [];
  const videos: CaseStudyVideoRef[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    const base = path.basename(file.name, ext);
    const friendly = base
      .replace(/^[0-9]+[\s_-]*/, "")
      .replace(/[-_]/g, " ")
      .trim();

    // Encode each segment of the relative path individually so a
    // sub-directory like "screenshots" and a file like "foo bar.png"
    // both resolve correctly via the dev/prod server.
    const encodedRel = file.rel
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const url = `${dir}/${encodedRel}`;

    const overrides =
      project.mediaOverrides?.[file.name] ?? project.mediaOverrides?.[file.rel];

    if (IMAGE_EXT.has(ext)) {
      images.push({
        src: url,
        slot: file.name,
        alt: friendly || file.name,
        aspect: "aspect-[16/10]",
        mask: "fade-bottom",
        ...overrides,
      });
    } else if (VIDEO_EXT.has(ext)) {
      videos.push({
        src: url,
        alt: friendly || file.name,
        caption: file.name,
        aspect: "aspect-[16/10]",
        ...overrides,
      });
    }
  }

  // Stable order by relative path — controls visual sequence via filename.
  images.sort((a, b) => a.src.localeCompare(b.src));
  videos.sort((a, b) => a.src.localeCompare(b.src));

  return { images, videos };
}

interface DiscoveredFile {
  /** Absolute path on disk. */
  abs: string;
  /** Relative path from the media root, forward-slash joined. */
  rel: string;
  /** Bare file name (no directory). */
  name: string;
}

function walk(dir: string, base: string): DiscoveredFile[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const out: DiscoveredFile[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // hidden / .DS_Store etc.
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs, base));
    } else if (entry.isFile()) {
      const rel = path.relative(base, abs).split(path.sep).join("/");
      out.push({ abs, rel, name: entry.name });
    }
  }
  return out;
}

function safeExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}
