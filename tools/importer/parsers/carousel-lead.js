/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-lead. Base: carousel.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-04
 *
 * Library convention (Carousel): 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one slide: cell 1 = image (mandatory), cell 2 = optional
 * text content (title / description / CTA).
 *
 * Source structure: div.cmp-carousel > .cmp-carousel__content > .cmp-carousel__item
 * (one per slide). On detail-article pages each item is a full-bleed lead image
 * (.image .cmp-image img.cmp-image__image) with no text overlay. Extraction is
 * defensive so occasional multi-image or captioned slides are still captured.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each carousel item is a slide. The actions/indicators containers are separate.
  const items = element.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    const image = item.querySelector('.cmp-image img, img.cmp-image__image, img');

    // Optional text content (not present on the lead-image variant, but supported).
    const contentCell = [];
    const title = item.querySelector('h1, h2, h3, .cmp-title__text, .cmp-teaser__title');
    const description = item.querySelector('.cmp-teaser__description, .cmp-text p, p');
    const cta = item.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-button a');

    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    // Slide requires at least an image or some content.
    if (!image && contentCell.length === 0) return;

    cells.push([image || '', contentCell.length ? contentCell : '']);
  });

  // If no slides were found, unwrap gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-lead', cells });
  element.replaceWith(block);
}
