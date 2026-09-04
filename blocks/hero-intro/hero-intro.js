export default function decorate(block) {
  // hero-intro: full-bleed background image with a light overlay card
  // holding a heading and intro paragraph. Rows may be omitted by authors,
  // so decorate defensively.
  const rows = [...block.children];

  // Identify the image row (a row that only contains a picture/img) and the
  // text row (heading + paragraph). Either may be missing.
  let imageRow;
  let contentRow;
  rows.forEach((row) => {
    if (!imageRow && row.querySelector('picture, img')) {
      imageRow = row;
    } else if (!contentRow) {
      contentRow = row;
    }
  });

  if (imageRow) imageRow.classList.add('hero-intro-image');

  if (contentRow) {
    contentRow.classList.add('hero-intro-content');
  } else if (imageRow) {
    // If there is no dedicated content row, wrap any stray text nodes.
    const stray = rows.find((r) => r !== imageRow && r.textContent.trim());
    if (stray) stray.classList.add('hero-intro-content');
  }
}
