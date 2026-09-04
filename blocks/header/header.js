// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggle the mobile menu open/closed.
 * @param {Element} nav The nav element
 * @param {boolean|null} forceExpanded Optional forced state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/**
 * Build the search control (form/input are created here, not in the fragment).
 * @returns {Element} the search wrapper
 */
function buildSearch() {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-search';
  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.action = '/us/en/search';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  form.append(input);
  wrapper.append(form);
  return wrapper;
}

/**
 * Turn the country-grouped locale list into a click-toggle dropdown.
 * Mirrors the source: an "en-US" toggle with the US flag + caret opening a
 * fixed dark panel of country groups (flag + language links).
 * @param {Element} localeSection the locale nav section
 */
function decorateLocale(localeSection) {
  const panel = localeSection.querySelector('ul');
  if (!panel) return;
  panel.classList.add('nav-locale-panel');

  // current locale = the first language link (source marks en-US active)
  const firstLink = panel.querySelector('a');
  const currentLabel = firstLink ? firstLink.textContent.trim() : 'en-US';
  const currentFlag = localeSection.querySelector('img');
  const flagSrc = currentFlag ? currentFlag.getAttribute('src') : '';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-locale-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Toggle language');
  toggle.innerHTML = `${flagSrc ? `<img src="${flagSrc}" alt="">` : ''}<span>${currentLabel}</span>`;
  localeSection.prepend(toggle);

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    localeSection.classList.toggle('open', !open);
  });
  document.addEventListener('click', (e) => {
    if (!localeSection.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      localeSection.classList.remove('open');
    }
  });
}

/**
 * Loads and decorates the header nav.
 * Content lives in /content/nav.plain.html (fragment); this reads and renders it.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // section roles by order in the fragment: brand, sections (nav), locale, tools
  const roles = ['brand', 'sections', 'locale', 'tools'];
  roles.forEach((role, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${role}`);
  });

  // brand logo link cleanup (strip any button decoration)
  const brandLink = nav.querySelector('.nav-brand a');
  if (brandLink) {
    brandLink.className = '';
    const container = brandLink.closest('p');
    if (container) container.className = '';
  }

  // locale dropdown
  const localeSection = nav.querySelector('.nav-locale');
  if (localeSection) decorateLocale(localeSection);

  // tools: sign-in + search
  const tools = nav.querySelector('.nav-tools');
  if (tools) tools.append(buildSearch());

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // reset to closed on breakpoint change (prevents mobile state leaking to desktop)
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
