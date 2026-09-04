/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-team. Base: cards.
 * Source: https://wknd.site/us/en/about-us.html (content-overview template)
 * Generated: 2026-09-04
 *
 * Invocation model: the import script runs this parser ONCE PER matched element.
 * The instances selector is `.cmp-experience-fragment--contributor`, and each
 * matched element is a SINGLE person card (7 on the page: 4 contributors + 3 guides).
 * So this parser transforms one person-card element into a cards block with a
 * single card row: [ image cell, text cell ]. createBlock adds the `cards-team`
 * name row automatically.
 *
 * Cards is a 2-column block (per library-description.txt):
 *   - cell 1: image (mandatory) — the circular avatar
 *   - cell 2: text content — heading (name), role/title, and CTA links (socials)
 */
export default function parse(element, { document }) {
  // --- Image (avatar) ---
  // Source: <div class="cmp-image"><img class="cmp-image__image" ...></div>
  const image = element.querySelector('.cmp-image img, img.cmp-image__image, img');

  // --- Name (heading) ---
  // First title in the card: <h3 class="cmp-title__text">Name</h3>
  const titles = Array.from(element.querySelectorAll('.cmp-title .cmp-title__text, .cmp-title__text'));
  const name = titles[0] || null;
  // --- Role / title (second title) ---
  // Second title: <h5 class="cmp-title__text">Role | ...</h5> (in .cmp-title--black)
  const role = element.querySelector('.cmp-title--black .cmp-title__text') || titles[1] || null;

  // --- Social links (CTAs) ---
  // <div class="...cmp-buildingblock--btn-list"> ... <a class="cmp-button" href="#...">
  //   <span class="cmp-button__icon ..."></span><span class="cmp-button__text">Facebook</span></a>
  // Rebuild clean anchors so markdown produces readable labelled links.
  const socialAnchors = Array.from(element.querySelectorAll('a.cmp-button, .cmp-buildingblock--btn-list a[href]'))
    .map((a) => {
      const href = a.getAttribute('href');
      if (!href) return null;
      const label = (a.querySelector('.cmp-button__text')?.textContent || a.textContent || href).trim();
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = label;
      return link;
    })
    .filter(Boolean);

  // --- Empty-block guard: bail gracefully if the card has no meaningful content ---
  if (!image && !name && !role && socialAnchors.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // --- Build the text cell (cell 2) ---
  const textCell = [];
  if (name) textCell.push(name);
  if (role) textCell.push(role);
  if (socialAnchors.length) {
    // Group the social links in a single paragraph so they render as a link row.
    const socialRow = document.createElement('p');
    socialAnchors.forEach((link, i) => {
      if (i > 0) socialRow.append(' ');
      socialRow.append(link);
    });
    textCell.push(socialRow);
  }

  // --- Assemble the single card row: 2 columns [image, text] ---
  const cells = [];
  cells.push([image || '', textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
