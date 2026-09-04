/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://wknd.site/us/en/adventures.html
 * Generated: 2026-09-04
 *
 * Library convention (Hero): 1 column, 3 rows. First row = block name.
 * Row 2's single cell = background image (optional).
 * Row 3's single cell = title (heading), subheading, and optional CTA.
 *
 * Source structure: div.teaser.cmp-teaser--hero > .cmp-teaser with a text side
 * (.cmp-teaser__content: h2.cmp-teaser__title, .cmp-teaser__description) and an
 * image side (.cmp-teaser__image img). This variant has NO CTA — a full-bleed
 * background photo with a light overlay card (heading + intro paragraph).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 2: full-bleed background image (optional).
  const image = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Row 3: overlay card content — heading + intro paragraph (no CTA in this variant).
  const contentCell = [];
  const title = element.querySelector('h1, h2, h3, .cmp-teaser__title');
  const description = element.querySelector('.cmp-teaser__description, .cmp-teaser__content p, p');

  if (title) contentCell.push(title);
  if (description) contentCell.push(description);

  // Bail gracefully if there is no meaningful content.
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single-column block: each row holds exactly one cell.
  if (image) cells.push([image]);
  cells.push([contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
