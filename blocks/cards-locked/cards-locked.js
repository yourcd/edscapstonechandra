import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Members-only locked tiles (source: cmp-teaser--secure).
 * Authoring model — one row per tile, cells in any order containing:
 *   a picture (tile image), a heading (title), a paragraph (subtitle),
 *   and a link (Read More target).
 * Renders each as a locked tile: title with a yellow lock corner ribbon,
 * subtitle, a READ MORE button, and the dimmed image below.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // gather the pieces from the row (order-independent)
    const picture = row.querySelector('picture');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const link = row.querySelector('a[href]');
    // subtitle = a paragraph that is not just the link/picture wrapper
    const subtitle = [...row.querySelectorAll('p')]
      .find((p) => p.textContent.trim() && !p.querySelector('a, picture'));

    const body = document.createElement('div');
    body.className = 'cards-locked-body';
    if (heading) {
      const title = document.createElement('h3');
      title.className = 'cards-locked-title';
      title.textContent = heading.textContent.trim();
      body.append(title);
    }
    if (subtitle) {
      const sub = document.createElement('p');
      sub.className = 'cards-locked-subtitle';
      sub.textContent = subtitle.textContent.trim();
      body.append(sub);
    }
    if (link) {
      const cta = document.createElement('a');
      cta.className = 'cards-locked-cta';
      cta.href = link.getAttribute('href');
      cta.textContent = 'Read More';
      body.append(cta);
    }
    li.append(body);

    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'cards-locked-image';
      imageWrap.append(picture);
      li.append(imageWrap);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
