import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each gallery item is either a photo or a video, identified by which of
// `image`/`vimeoId` it sets:
//
//   - Photo: a markdown file co-located with its image file (e.g.
//     src/content/galleries/portraits/001-placeholder.{md,jpg}). The
//     `image()` schema helper validates the relative path and hands back an
//     optimized image reference usable directly with Astro's <Image>.
//   - Video: a markdown-only file (no co-located image) pointing at a
//     Vimeo video via `vimeoId`, plus a `thumbnail` URL (Vimeo's own CDN,
//     not a local/optimized asset) used anywhere a grid needs a still.
const galleries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/galleries" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        category: z.string(),
        order: z.number(),
        alt: z.string(),
        featured: z.boolean().default(false),
        image: image().optional(),
        vimeoId: z.string().optional(),
        thumbnail: z.url().optional(),
      })
      .refine((data) => Boolean(data.image) !== Boolean(data.vimeoId), {
        message:
          "Each gallery entry needs exactly one of `image` (a photo) or `vimeoId` (a video).",
      })
      .refine((data) => !data.vimeoId || Boolean(data.thumbnail), {
        message: "A video entry (`vimeoId`) also needs a `thumbnail` URL.",
      }),
});

export const collections = { galleries };
