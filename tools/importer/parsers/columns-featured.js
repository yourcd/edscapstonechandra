/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-04
 *
 * Library convention (Columns): multiple columns/rows. First row = block name.
 * Second row's cells each become a column; determine columns from the natural
 * visual grouping of the content.
 *
 * Source structure: div.cmp-teaser--featured > .cmp-teaser containing a text side
 * (.cmp-teaser__content: pretitle, h2 title, description, CTA) and an image side
 * (.cmp-teaser__image img). Rendered as a two-column featured teaser: text | image.
 */
export default function parse(element, { document }) {
  // Text column: pretitle, title, description, CTA.
  const textCell = [];
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const title = element.querySelector('h1, h2, h3, .cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a');

  if (pretitle) textCell.push(pretitle);
  if (title) textCell.push(title);
  if (description) textCell.push(description);
  if (cta) textCell.push(cta);

  // Image column.
  const image = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Bail gracefully if there is no meaningful content.
  if (textCell.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Two columns: text | image.
  const cells = [[textCell.length ? textCell : '', image || '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
