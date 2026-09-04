export default function decorate(block) {
  // Single-column block: rows are image (optional) and content.
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img')) {
      row.classList.add('hero-teaser-image');
    } else {
      row.classList.add('hero-teaser-content');
    }
  });

  if (!block.querySelector('.hero-teaser-image')) {
    block.classList.add('no-image');
  }

  // Style the standalone CTA link as a button (the source teaser CTA is a
  // solid yellow button, but the plain authored link isn't auto-buttonized
  // by the global decorator, which requires bold/italic formatting).
  const content = block.querySelector('.hero-teaser-content') || block;
  content.querySelectorAll('p > a:only-child').forEach((a) => {
    if (a.parentElement.textContent.trim() === a.textContent.trim()) {
      a.classList.add('button');
      a.parentElement.classList.add('button-container');
    }
  });
}
