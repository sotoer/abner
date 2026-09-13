import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";

export type GalleryEntry = CollectionEntry<"galleries">;

export function isVideo(entry: GalleryEntry): boolean {
  return Boolean(entry.data.vimeoId);
}

// Vimeo's own CDN thumbnails are always 16:9 in this gallery — there's no
// local image to read real dimensions from for a video entry.
const VIDEO_ASPECT = { width: 16, height: 9 };

export function getAspectRatio(entry: GalleryEntry): {
  width: number;
  height: number;
} {
  if (entry.data.image) {
    return { width: entry.data.image.width, height: entry.data.image.height };
  }
  return VIDEO_ASPECT;
}

export function isPortraitEntry(entry: GalleryEntry): boolean {
  const { width, height } = getAspectRatio(entry);
  return height > width;
}

export interface Slide {
  kind: "photo" | "video";
  src?: string; // photo only: full-size image src for the lightbox
  vimeoId?: string; // video only: embedded via Lightbox's Vimeo player
  thumbnail: string; // grid/filmstrip still, for either kind
  alt: string;
  caption: string;
}

// A slide for the lightbox: a large render of the photo, or the video's
// id + its own remote thumbnail (the player itself is embedded lazily by
// Lightbox, only once a video slide is actually shown).
export async function toSlide(entry: GalleryEntry): Promise<Slide> {
  if (entry.data.vimeoId) {
    return {
      kind: "video",
      vimeoId: entry.data.vimeoId,
      thumbnail: entry.data.thumbnail!,
      alt: entry.data.alt,
      caption: entry.data.title,
    };
  }
  const full = await getImage({ src: entry.data.image!, width: 1600 });
  return {
    kind: "photo",
    src: full.src,
    thumbnail: full.src,
    alt: entry.data.alt,
    caption: entry.data.title,
  };
}

// A small render for grid/mosaic thumbnails: an optimized local image for
// a photo, or the video's own remote (already appropriately sized)
// thumbnail — Astro's image pipeline only optimizes local project assets.
export async function toThumb(
  entry: GalleryEntry,
  width: number,
): Promise<{ src: string; alt: string }> {
  if (entry.data.vimeoId) {
    return { src: entry.data.thumbnail!, alt: entry.data.alt };
  }
  const thumb = await getImage({ src: entry.data.image!, width });
  return { src: thumb.src, alt: entry.data.alt };
}
