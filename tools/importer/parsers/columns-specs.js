/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-specs. Base: columns.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-04
 *
 * Library convention (Columns): multiple columns/rows. First row = block name.
 * The second row establishes the column count; every subsequent row must match it.
 *
 * Source structure: article.cmp-contentfragment > h3.cmp-contentfragment__title
 * (adventure title) + dl.cmp-contentfragment__elements. Each
 * div.cmp-contentfragment__element holds a dt (label) and dd (value).
 * This is a label | value fact panel, so each spec becomes one 2-column row
 * [label, value]. The title is emitted as its own 2-column row [title, ''] so
 * the column count stays consistent.
 */
export default function parse(element, { document }) {
  const cells = [];

  const title = element.querySelector('.cmp-contentfragment__title, h1, h2, h3');
  if (title) cells.push([title, '']);

  const specs = element.querySelectorAll('.cmp-contentfragment__element, dl > div');
  specs.forEach((spec) => {
    const label = spec.querySelector('.cmp-contentfragment__element-title, dt');
    const value = spec.querySelector('.cmp-contentfragment__element-value, dd');
    if (!label && !value) return;
    // Trim whitespace-only text nodes so the value cell renders cleanly.
    if (value) value.textContent = value.textContent.trim();
    cells.push([label || '', value || '']);
  });

  // If no label/value content was found, unwrap gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-specs', cells });
  element.replaceWith(block);
}
