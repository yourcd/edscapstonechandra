/**
 * Loads and decorates the footer.
 * Content lives in /content/footer.plain.html (fragment); this reads and renders it.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

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
