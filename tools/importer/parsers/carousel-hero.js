/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-04
 *
 * Library convention (Carousel): 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one slide: cell 1 = image (mandatory), cell 2 = text
 * content (optional title / description / CTA).
 *
 * Source structure: div.cmp-carousel > .cmp-carousel__content > .cmp-carousel__item
 * (one per slide), each holding a .cmp-teaser with title (h2.cmp-teaser__title),
 * description (.cmp-teaser__description), CTA (a.cmp-teaser__action-link) and image
 * (.cmp-teaser__image img.cmp-image__image).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each carousel item is a slide. Exclude the actions/indicators containers.
  const items = element.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    const image = item.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

    const contentCell = [];
    const title = item.querySelector('h1, h2, h3, .cmp-teaser__title');
    const description = item.querySelector('.cmp-teaser__description, p');
    const cta = item.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a, a');

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
