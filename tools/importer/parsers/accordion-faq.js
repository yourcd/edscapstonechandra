/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd.site/us/en/faqs.html
 * Generated: 2026-09-04
 *
 * Convention (library-description.txt): 2-column accordion table.
 *   Row 1: block name.
 *   Each subsequent row = one accordion item: [Title cell, Content cell].
 *
 * Source DOM: div.accordion.panelcontainer > .cmp-accordion contains
 *   .cmp-accordion__item nodes. Each item has a header title in
 *   .cmp-accordion__header .cmp-accordion__title and body rich text in
 *   .cmp-accordion__panel (wrapped in .container > .cmp-container > .text > .cmp-text).
 */
export default function parse(element, { document }) {
  // The target element may be the outer .accordion.panelcontainer wrapper or the
  // inner .cmp-accordion; either way the items live under .cmp-accordion__item.
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  const cells = [];

  items.forEach((item) => {
    // --- Title cell (mandatory): the clickable question label ---
    const titleEl = item.querySelector(
      '.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header',
    );
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Preserve the question as a heading for semantic accordion labels.
    const titleCell = document.createElement('h3');
    titleCell.textContent = titleText;

    // --- Content cell (mandatory): the answer rich text revealed on expand ---
    const panel = item.querySelector('.cmp-accordion__panel');
    // Prefer the innermost rich-text container to avoid AEM wrapper divs;
    // fall back progressively so cross-page variations still yield content.
    const contentSource = (panel && panel.querySelector('.cmp-text'))
      || (panel && panel.querySelector('.text'))
      || panel;

    const contentCell = [];
    if (contentSource) {
      // Move the actual rich-text child nodes (p, h*, lists, links, etc.).
      contentCell.push(...contentSource.childNodes);
    }

    // Only emit a row when we have a question or an answer to show.
    if (titleText || contentCell.length) {
      cells.push([titleCell, contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard: no accordion items found — unwrap rather than emit an empty block.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
