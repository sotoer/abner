import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each gallery item is a markdown file co-located with its image file
// (e.g. src/content/galleries/portraits/001-placeholder.{md,jpg}). The
// `image()` schema helper validates the relative path and hands back an
// optimized image reference usable directly with Astro's <Image>.
const galleries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/galleries" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      order: z.number(),
      alt: z.string(),
      featured: z.boolean().default(false),
      image: image(),
    }),
});

export const collections = { galleries };
