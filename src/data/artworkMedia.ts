/**
 * Optimised variants of the artwork images. The original files (used by featuredData and the
 * full-screen preview) are untouched; these are only used where a smaller image is enough.
 *  - display: ~960px WebP for grid cards
 *  - thumbs: 512px WebP for the infinite grid and slider strip
 */
import hero from "@/assets/hero-img.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import p8 from "@/assets/portfolio-8.jpg";
import p9 from "@/assets/portfolio-9.jpg";
import p10 from "@/assets/portfolio-10.jpg";

import heroD from "@/assets/display/hero-img-display.webp";
import p1D from "@/assets/display/portfolio-1-display.webp";
import p2D from "@/assets/display/portfolio-2-display.webp";
import p3D from "@/assets/display/portfolio-3-display.webp";
import p4D from "@/assets/display/portfolio-4-display.webp";
import p5D from "@/assets/display/portfolio-5-display.webp";
import p6D from "@/assets/display/portfolio-6-display.webp";
import p8D from "@/assets/display/portfolio-8-display.webp";
import p9D from "@/assets/display/portfolio-9-display.webp";
import p10D from "@/assets/display/portfolio-10-display.webp";

import p1T from "@/assets/thumbs/portfolio-1-512.webp";
import p2T from "@/assets/thumbs/portfolio-2-512.webp";
import p3T from "@/assets/thumbs/portfolio-3-512.webp";
import p4T from "@/assets/thumbs/portfolio-4-512.webp";
import p5T from "@/assets/thumbs/portfolio-5-512.webp";
import p6T from "@/assets/thumbs/portfolio-6-512.webp";
import p8T from "@/assets/thumbs/portfolio-8-512.webp";
import p9T from "@/assets/thumbs/portfolio-9-512.webp";
import p10T from "@/assets/thumbs/portfolio-10-512.webp";

const display: Record<string, string> = {
  [hero]: heroD,
  [p1]: p1D,
  [p2]: p2D,
  [p3]: p3D,
  [p4]: p4D,
  [p5]: p5D,
  [p6]: p6D,
  [p8]: p8D,
  [p9]: p9D,
  [p10]: p10D,
};

/** ~960px image for on-page display; falls back to the original. */
export function displaySrc(original: string): string {
  return display[original] ?? original;
}

/** 512px thumbnail for the given original image. */
export function thumbSrc(original: string): string {
  return thumbs[original] ?? displaySrc(original);
}

/** Same order as portfolioItems. */
export const artworkThumbs: string[] = [p1T, p2T, p3T, p4T, p5T, p6T, p10T, p8T, p9T];

const thumbs: Record<string, string> = {
  [p1]: p1T,
  [p2]: p2T,
  [p3]: p3T,
  [p4]: p4T,
  [p5]: p5T,
  [p6]: p6T,
  [p8]: p8T,
  [p9]: p9T,
  [p10]: p10T,
};
