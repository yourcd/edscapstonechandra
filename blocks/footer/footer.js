/**
 * Loads and decorates the footer.
 * Content lives in /content/footer.plain.html (fragment); this reads and renders it.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // The footer fragment is served from the site root on both localhost and prod
  // (the /content prefix is not part of the served URL), so fetch it directly —
  // an earlier /content/ attempt only ever 404s in prod and wastes a round trip.
  const resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // The fragment's image paths are relative to the fragment, which sits at the
  // site root (e.g. "./media_x.svg" or "images/x.svg"). Left alone they would
  // resolve against the current page URL, so re-root them to "/" — strip a
  // leading "./" and add the root slash.
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|\/|data:)/.test(src)) {
      img.setAttribute('src', `/${src.replace(/^\.\//, '')}`);
    }
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
