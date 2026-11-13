# Abner Soto logo

Viewfinder monogram: "AS" in Bebas Neue inside camera-frame corners, with a
recording-light dot. Names are set in Montserrat. All text is converted to
outlines, so the files don't depend on any installed fonts.

| File | Use |
| --- | --- |
| `abner-soto-mark-*` | Profile pictures, watermarks, social avatars |
| `abner-soto-horizontal-*` | Email signature, invoices, proposals, documents |
| `abner-soto-stacked-*` | Business cards, gallery and contract covers |
| `abner-soto-app-icon` | App/home-screen icon (same art as the site favicon) |

Variants: `dark` for light backgrounds, `light` for dark backgrounds, `white`
for watermarks over photos. Each comes as SVG (scalable, use for print) and
PNG (2000px wide for lockups, 1024px square for the mark and icon).

Colors: ink `#1a1a1a`, paper `#faf9f7`, recording dot `#c4643d`.

The site header uses `src/assets/logo-horizontal.svg` (mark and name only,
no tagline) and `src/assets/logo-mark.svg` on narrow screens. Both use
`currentColor`, so they follow the nav's text color.
