import { createOptimizedPicture } from '../../scripts/aem.js';
import { getLocale, getLocaleItems } from '../../scripts/locale.js';

const MAX_DESC_WORDS = 6;

/**
 * Truncate a card's description to the first MAX_DESC_WORDS words and append an
 * ellipsis to signal there is more to read on the linked article.
 * @param {Element} body the card body element
 */
function truncateDescription(body) {
  // description = the last paragraph in the body (the title link sits above it)
  const paragraphs = [...body.querySelectorAll('p')];
  const desc = paragraphs[paragraphs.length - 1];
  if (!desc) return;
  const words = desc.textContent.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_DESC_WORDS) return;
  desc.textContent = `${words.slice(0, MAX_DESC_WORDS).join(' ')}…`;
}

/**
 * Turns the block's rows into the card list markup (ul > li with image + body),
 * optimizes images and truncates descriptions. Shared by the authored-content
 * fallback and the dynamic (query-index) render path.
 * @param {Element} block the cards-articles block
 */
function renderCards(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-articles-card-image';
      else div.className = 'cards-articles-card-body';
    });
    const body = li.querySelector('.cards-articles-card-body');
    if (body) truncateDescription(body);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}

const TYPES = ['magazine', 'adventures'];

/**
 * Determines the content type this grid lists ("magazine" or "adventures").
 * Uses several row-independent signals so detection still works after the
 * authored card rows are removed (the block is then empty):
 *   1. a block variant class (e.g. cards-articles (magazine))
 *   2. the authored card links, if any remain
 *   3. the nearest CTA link after the block (kept "All Articles"/"All Trips")
 *   4. the preceding section heading text
 *   5. the current page path (on a listing page)
 * @param {Element} block the cards-articles block
 * @returns {string|null} the content-type segment, or null if undetectable
 */
function detectType(block) {
  // 1. block variant class
  const variant = TYPES.find((t) => block.classList.contains(t));
  if (variant) return variant;

  // 2. authored card links
  const inHrefs = [...block.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '');
  const fromCards = TYPES.find((t) => inHrefs.some((h) => new RegExp(`/${t}/`).test(h)));
  if (fromCards) return fromCards;

  // 3. nearest CTA link near the block (its section / following siblings)
  const scope = block.closest('.section') || document;
  const ctaHrefs = [...scope.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '');
  const fromCta = TYPES.find((t) => ctaHrefs.some((h) => new RegExp(`/${t}(/|$)`).test(h)));
  if (fromCta) return fromCta;

  // 4. preceding heading text (e.g. "Recent Articles" / "Next Adventures")
  let prev = block.previousElementSibling;
  while (prev && !/^H[1-6]$/.test(prev.tagName)) prev = prev.previousElementSibling;
  const heading = (prev ? prev.textContent : '').toLowerCase();
  if (/article/.test(heading)) return 'magazine';
  if (/adventure|trip/.test(heading)) return 'adventures';

  // 5. current page path
  const seg = window.location.pathname.split('/').filter(Boolean)[2];
  return TYPES.includes(seg) ? seg : null;
}

/**
 * Builds an authored-shape row (two divs: image + body) for one index item so
 * it flows through the same renderCards() path as static content.
 * @param {object} item a query-index row
 * @returns {Element} a row element
 */
function rowFromItem(item) {
  const row = document.createElement('div');
  const imageDiv = document.createElement('div');
  if (item.image) {
    imageDiv.append(createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]));
  }
  const bodyDiv = document.createElement('div');
  const h3 = document.createElement('h3');
  const link = document.createElement('a');
  link.href = item.path;
  link.textContent = item.title || '';
  h3.append(link);
  bodyDiv.append(h3);
  if (item.description) {
    const p = document.createElement('p');
    p.textContent = item.description;
    bodyDiv.append(p);
  }
  row.append(imageDiv, bodyDiv);
  return row;
}

export default async function decorate(block) {
  const type = detectType(block);

  // Dynamic path: replace authored cards with live, locale-filtered index data.
  if (type) {
    const locale = getLocale();
    // Full listing on the type's own page (e.g. /ca/en/magazine); a short
    // preview (4) everywhere else (e.g. the homepage "Recent Articles").
    const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
    const isListingPage = currentPath === `${locale}/${type}`;
    const items = await getLocaleItems(type, isListingPage ? {} : { limit: 4 });

    if (items.length) {
      block.textContent = '';
      items.forEach((item) => block.append(rowFromItem(item)));
      renderCards(block);
      return;
    }
    // No matching items for this locale/type — fall through to authored content
    // if any exists, otherwise leave the block empty (graceful empty state).
    if (!block.children.length) return;
  }

  // Fallback: render whatever was authored (also used if the index is empty or
  // the fetch failed).
  renderCards(block);
}
