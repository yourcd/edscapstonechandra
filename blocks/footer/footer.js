/**
 * Loads and decorates the footer.
 * Content lives in /content/footer.plain.html (fragment); this reads and renders it.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let base = '/content/';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    base = '/';
    resp = await fetch('/footer.plain.html');
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // The fragment's image paths are relative to the fragment (e.g. images/…),
  // which would otherwise resolve against the current page URL. Re-root them to
  // the fragment's own directory so the logo and social icons load everywhere.
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|\/|data:)/.test(src)) img.setAttribute('src', `${base}${src}`);
  });

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag sections by order: brand, nav, social, legal
  const roles = ['brand', 'nav', 'social', 'legal'];
  roles.forEach((role, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${role}`);
  });

  block.append(footer);
}
