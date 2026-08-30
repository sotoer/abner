/**
 * Prefixes an internal, root-relative path with the site's configured
 * `base` (see astro.config.mjs) so links keep working when the site is
 * deployed under a subpath, e.g. GitHub Pages project sites served at
 * https://<user>.github.io/<repo>/ rather than the domain root.
 *
 * Astro's own asset pipeline (astro:assets, the Image component, bundled
 * scripts/styles) already applies `base` automatically — this is only
 * needed for hardcoded hrefs/srcs we write ourselves (nav links, the
 * favicon, etc).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}` || "/";
}
