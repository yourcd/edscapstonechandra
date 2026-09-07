import { createOptimizedPicture } from '../../scripts/aem.js';

const MAX_DESC_WORDS = 6;

/**
 * Truncate a card's description to the first MAX_DESC_WORDS words and append an
 * ellipsis to signal there is more to read on the linked article.
 * @param {Element} body the card body element
 */
function truncateDescription(body) {
  // description = the last paragraph in the body (the title link sits above it)
  const paragraphs = [...body.querySelectorAll('p')];
  const desc = paragraphs[paragraphs.length - 1];
  if (!desc) return;
  const words = desc.textContent.trim().split(/\s+/).filter(Boolean);
  if (words.length <= MAX_DESC_WORDS) return;
  desc.textContent = `${words.slice(0, MAX_DESC_WORDS).join(' ')}…`;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-articles-card-image';
      else div.className = 'cards-articles-card-body';
    });
    const body = li.querySelector('.cards-articles-card-body');
    if (body) truncateDescription(body);
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
