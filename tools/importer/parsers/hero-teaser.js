/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-teaser. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-04
 *
 * Library convention (Hero): 1 column, 3 rows. First row = block name.
 * Row 2's single cell = background image (optional).
 * Row 3's single cell = title (heading), subheading, CTA.
 *
 * Source structure: div.teaser > .cmp-teaser with a text side
 * (.cmp-teaser__content: pretitle, h2 title, description, CTA) and an image side
 * (.cmp-teaser__image img).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 2: background image (optional).
  const image = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Row 3: text content — pretitle, title, description, CTA.
  const contentCell = [];
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const title = element.querySelector('h1, h2, h3, .cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description');
  const cta = element.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a');

  if (pretitle) contentCell.push(pretitle);
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Bail gracefully if there is no meaningful content.
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single-column block: each row holds exactly one cell.
  if (image) cells.push([image]);
  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-teaser', cells });
  element.replaceWith(block);
}
