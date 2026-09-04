/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-04
 *
 * Library convention (Cards): 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one card: cell 1 = image (mandatory), cell 2 = text
 * content (title / description / optional CTA).
 *
 * Source structure: div.image-list > ul.cmp-image-list > li.cmp-image-list__item,
 * each li holds an article with:
 *   - a.cmp-image-list__item-image-link > .cmp-image-list__item-image img
 *   - a.cmp-image-list__item-title-link > span.cmp-image-list__item-title
 *   - span.cmp-image-list__item-description
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = element.querySelectorAll('li.cmp-image-list__item, .cmp-image-list__item');

  items.forEach((item) => {
    const image = item.querySelector('.cmp-image-list__item-image img, img.cmp-image__image, img');

    const contentCell = [];

    // Title — preserve as a link when the source wraps the title in an anchor.
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    if (titleLink && titleText) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href') || '';
      link.textContent = titleText.textContent.trim();
      heading.append(link);
      contentCell.push(heading);
    } else if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText.textContent.trim();
      contentCell.push(heading);
    }

    // Description.
    const description = item.querySelector('.cmp-image-list__item-description, p');
    if (description) contentCell.push(description);

    // Skip empty cards.
    if (!image && contentCell.length === 0) return;

    cells.push([image || '', contentCell.length ? contentCell : '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
