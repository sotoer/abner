import type { CollectionEntry } from "astro:content";
import categoriesData from "../data/categories.json";
import { isPortraitEntry } from "./galleryMedia";

export interface CategoryCard {
  slug: string;
  label: string;
  order: number;
  // All of this category's entries, sorted by order. `cover` is just
  // entries[0], kept separate since most callers only need the one photo.
  entries: CollectionEntry<"galleries">[];
  cover: CollectionEntry<"galleries">;
  // The card this feeds crops to a landscape (4:3) box. A portrait-oriented
  // cover photo centered in that crop tends to lose the top of the subject,
  // so callers anchor those to the top instead of the default center.
  isPortrait: boolean;
}

/**
 * Groups every gallery entry by category (sorted by order) for use in
 * category-tile grids, e.g. the /work index and the homepage's featured
 * section — either of which may need just the cover photo or the full set.
 */
export function getCategoryCards(
  allEntries: CollectionEntry<"galleries">[],
): CategoryCard[] {
  return categoriesData
    .map((category) => {
      const entries = allEntries
        .filter((entry) => entry.data.category === category.slug)
        .sort((a, b) => a.data.order - b.data.order);
      const cover = entries[0];
      if (!cover) return null;
      const isPortrait = isPortraitEntry(cover);
      return { ...category, entries, cover, isPortrait };
    })
    .filter((card): card is NonNullable<typeof card> => card !== null)
    .sort((a, b) => a.order - b.order);
}
