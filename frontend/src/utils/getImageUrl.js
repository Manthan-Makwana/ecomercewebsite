/**
 * getImageUrl — resolves a product image URL correctly.
 *
 * Handles 3 cases:
 *  1. Already a full URL (Cloudinary / https) → return as-is
 *  2. Relative local path (./uploads/...) → prefix with backend base
 *  3. No image → return null (caller should use a placeholder)
 */

const BACKEND = "http://localhost:8000";

export function getImageUrl(imageArray) {
  if (!imageArray || imageArray.length === 0) return null;

  const raw = imageArray[0]?.url;
  if (!raw) return null;

  // Already a full URL (Cloudinary, https, http)
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  // Local path — strip leading "./" and prefix backend origin
  const cleaned = raw.replace(/^\.\//, "");
  return `${BACKEND}/${cleaned}`;
}
