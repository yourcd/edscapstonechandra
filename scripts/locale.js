/*
 * Shared locale + query-index helpers.
 *
 * The site is multi-locale (e.g. /us/en, /ca/en, /ca/fr, /ch/de …). Blocks that
 * render dynamic listings detect the current locale from the URL at runtime and
 * filter the global query-index by that locale, so a visitor only ever sees
 * content from their own locale.
 */

const QUERY_INDEX_PATH = '/query-index.json';

/**
 * The current page's locale prefix, derived from the first two path segments
 * (e.g. "/ca/en"). Falls back to "/us/en" when the path is too shallow.
 * @returns {string} locale prefix without a trailing slash
 */
export function getLocale() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  return segments.length >= 2 ? `/${segments[0]}/${segments[1]}` : '/us/en';
}

let queryIndexPromise;

/**
 * Fetches and caches the global query-index for the session. Multiple blocks on
 * a page (and navigation within the same session) reuse the single in-flight /
 * resolved promise rather than refetching.
 * @returns {Promise<Array>} the index rows (empty array on failure)
 */
export function fetchQueryIndex() {
  if (!queryIndexPromise) {
    queryIndexPromise = fetch(QUERY_INDEX_PATH)
      .then((resp) => {
        if (!resp.ok) throw new Error(`query-index ${resp.status}`);
        return resp.json();
      })
      .then((json) => (Array.isArray(json) ? json : json.data) || [])
      .catch((error) => {
        // fail silently — callers keep their authored fallback content
        // eslint-disable-next-line no-console
        console.error('Failed to load query-index', error);
        queryIndexPromise = undefined; // allow a later retry
        return [];
      });
  }
  return queryIndexPromise;
}

/**
 * Returns index rows for the current locale and a content type (e.g. "magazine",
 * "adventures"), sorted by lastmodified descending (most recent first). Excludes
 * nested sub-paths like members-only so only top-level articles are listed.
 * @param {string} type content-type folder segment
 * @param {object} [opts]
 * @param {number} [opts.limit] max rows to return (omit for all)
 * @returns {Promise<Array>} filtered, sorted rows
 */
export async function getLocaleItems(type, opts = {}) {
  const locale = getLocale();
  const prefix = `${locale}/${type}/`;
  const rows = await fetchQueryIndex();
  const allPaths = rows.map((r) => r.path || '');
  const items = rows
    .filter((item) => {
      const path = item.path || '';
      if (!path.startsWith(prefix)) return false;
      // only direct children of the type folder (exclude e.g. members-only/…)
      if (path.slice(prefix.length).split('/').filter(Boolean).length !== 1) return false;
      // exclude section-index/landing pages: a path that is the parent of other
      // indexed pages (e.g. …/magazine/members-only) is a listing, not an article
      return !allPaths.some((p) => p !== path && p.startsWith(`${path}/`));
    })
    .sort((a, b) => (b.lastmodified || 0) - (a.lastmodified || 0));
  return opts.limit ? items.slice(0, opts.limit) : items;
}
