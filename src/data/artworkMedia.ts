/**
 * Optimised variants of the artwork images. The original files (used by featuredData and the
 * full-screen preview) are untouched; these are only used where a smaller image is enough.
 *  - display: ~960px WebP for grid cards
 *  - thumbs: 512px WebP for the infinite grid and slider strip
 *
 * Variants are matched to their original by file name: portfolio-12.jpg ->
 * display/portfolio-12-display.webp and thumbs/portfolio-12-512.webp.
 */
const glob = {
  // portfolio-7 is an unused duplicate of portfolio-8; keep it out of the build
  originals: import.meta.glob<string>(["/src/assets/hero-img.jpg", "/src/assets/portfolio-*.jpg", "!**/portfolio-7.jpg"], {
    eager: true,
    import: "default",
  }),
  display: import.meta.glob<string>("/src/assets/display/*-display.webp", { eager: true, import: "default" }),
  thumbs: import.meta.glob<string>("/src/assets/thumbs/*-512.webp", { eager: true, import: "default" }),
};

const baseName = (path: string) => path.replace(/^.*\//, "").replace(/(-display|-512)?\.\w+$/, "");

const byName = (files: Record<string, string>) =>
  new Map(Object.entries(files).map(([path, url]) => [baseName(path), url]));

/** original image url -> variant url, for every original that has that variant */
function variantsFor(files: Record<string, string>): Record<string, string> {
  const named = byName(files);
  const out: Record<string, string> = {};
  for (const [path, url] of Object.entries(glob.originals)) {
    const variant = named.get(baseName(path));
    if (variant) out[url] = variant;
  }
  return out;
}

const display = variantsFor(glob.display);
const thumbs = variantsFor(glob.thumbs);

/** ~960px image for on-page display; falls back to the original. */
export function displaySrc(original: string): string {
  return display[original] ?? original;
}

/** 512px thumbnail for the given original image. */
export function thumbSrc(original: string): string {
  return thumbs[original] ?? displaySrc(original);
}
