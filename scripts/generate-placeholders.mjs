#!/usr/bin/env node
/**
 * One-off scaffolding utility: generates placeholder gallery images (as
 * real rasters, so Astro's Sharp-backed image pipeline actually runs) plus
 * their matching markdown entries, at a handful of varied aspect ratios so
 * the masonry grid has something realistic to lay out.
 *
 * This script and its generated files are throwaway — delete both once
 * real photography replaces the placeholders.
 *
 * Usage: node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = new URL("../src/content/galleries/", import.meta.url);

const PALETTE = ["#b85c38", "#3c4a3e", "#c9a66b", "#4a5a6a", "#8a3b3b"];

const CATEGORIES = [
  {
    slug: "portraits",
    label: "Portraits",
    shots: [
      { w: 900, h: 1200 },
      { w: 1000, h: 1000 },
      { w: 800, h: 1100 },
      { w: 1100, h: 850 },
      { w: 950, h: 1250 },
    ],
  },
  {
    slug: "landscapes",
    label: "Landscapes",
    shots: [
      { w: 1300, h: 850 },
      { w: 1200, h: 800 },
      { w: 1400, h: 900 },
      { w: 1000, h: 1000 },
      { w: 1250, h: 780 },
    ],
  },
  {
    slug: "editorial",
    label: "Editorial",
    shots: [
      { w: 1000, h: 1300 },
      { w: 1100, h: 900 },
      { w: 900, h: 1200 },
      { w: 1200, h: 800 },
      { w: 950, h: 1150 },
    ],
  },
];

function svgFor(width, height, color, label) {
  const fontSize = Math.round(Math.min(width, height) / 12);
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif"
            font-size="${fontSize}" text-anchor="middle"
            dominant-baseline="middle" opacity="0.85">${label}</text>
    </svg>
  `;
}

async function main() {
  for (const category of CATEGORIES) {
    const dir = new URL(`${category.slug}/`, ROOT);
    await mkdir(dir, { recursive: true });

    for (const [i, shot] of category.shots.entries()) {
      const index = String(i + 1).padStart(3, "0");
      const color = PALETTE[i % PALETTE.length];
      const label = `${category.label} ${i + 1}`;
      const imageName = `${index}-placeholder.jpg`;
      const svg = svgFor(shot.w, shot.h, color, label);

      await sharp(Buffer.from(svg))
        .jpeg({ quality: 82 })
        .toFile(fileURLToPath(new URL(imageName, dir)));

      const frontmatter = `---
title: "${label}"
category: "${category.slug}"
order: ${i + 1}
alt: "Placeholder ${category.label.toLowerCase()} image ${i + 1}, to be replaced with a real photo"
featured: ${i === 0}
image: ./${imageName}
---
`;
      await writeFile(
        fileURLToPath(new URL(`${index}-placeholder.md`, dir)),
        frontmatter,
      );
    }

    console.log(
      `Generated ${category.shots.length} placeholders for ${category.slug}`,
    );
  }
}

main();
