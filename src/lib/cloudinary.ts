/**
 * Cloudinary image optimization utility
 * Applies f_auto (format) + q_auto (quality) + optional resize
 * Works with both Cloudinary-hosted URLs and external URLs (via fetch/upload)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export interface CldTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb" | "pad";
  gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  dpr?: "auto" | number;
}

/**
 * Build an optimized Cloudinary URL from a public_id or existing Cloudinary URL.
 * Always applies f_auto + q_auto for best performance.
 */
export function getCldImageUrl(
  src: string,
  options: CldTransformOptions = {}
): string {
  if (!CLOUD_NAME) return src; // Fallback: no Cloudinary config

  const {
    width,
    height,
    crop = "fill",
    gravity = "auto",
    quality = "auto",
    format = "auto",
    dpr = "auto",
  } = options;

  // Build transformation string
  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
    `dpr_${dpr}`,
  ];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    transforms.push(`g_${gravity}`);
  }

  const transformStr = transforms.join(",");

  // If already a Cloudinary URL — inject transforms
  if (src.includes("res.cloudinary.com")) {
    // Insert before /upload/ segment
    return src.replace("/upload/", `/upload/${transformStr}/`);
  }

  // If a public_id (no http) — build fresh URL
  if (!src.startsWith("http")) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${src}`;
  }

  // External URL (nivoseas.com images, etc.) — return as-is
  // Once you migrate images to Cloudinary, they'll auto-optimize
  return src;
}

/**
 * Convenience presets for common image sizes used in this project
 */
export const cldPresets = {
  /** Product card thumbnail — 480x360 */
  thumbnail: (src: string) =>
    getCldImageUrl(src, { width: 480, height: 360, crop: "fill" }),

  /** Product detail main image — 800x800 */
  productMain: (src: string) =>
    getCldImageUrl(src, { width: 800, height: 800, crop: "fill" }),

  /** Product gallery thumb — 160x160 */
  galleryThumb: (src: string) =>
    getCldImageUrl(src, { width: 160, height: 160, crop: "fill" }),

  /** Related product card — 480x360 */
  related: (src: string) =>
    getCldImageUrl(src, { width: 480, height: 360, crop: "fill" }),

  /** Hero / banner — 1920x1080 */
  hero: (src: string) =>
    getCldImageUrl(src, { width: 1920, height: 1080, crop: "fill" }),
};

