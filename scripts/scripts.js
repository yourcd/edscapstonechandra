import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
} from './aem.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Builds a breadcrumb for adventure detail pages (source: cmp-breadcrumb).
 * The migrated content has no breadcrumb, so it is derived from the URL:
 * "Adventures / <Page Title>", with "Adventures" linking to the listing.
 * @param {Element} main The main container element
 */
function buildBreadcrumb(main) {
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  const segs = path.split('/').filter(Boolean);
  const advIdx = segs.indexOf('adventures');
  // only detail pages: exactly one slug after the "adventures" listing segment
  if (advIdx === -1 || advIdx !== segs.length - 2) return;

  const section = main.querySelector('.section');
  if (!section || section.querySelector('.breadcrumb')) return;

  const listingHref = `/${segs.slice(0, advIdx + 1).join('/')}`;
  const titleEl = main.querySelector('h1, h2');
  const title = (titleEl ? titleEl.textContent : segs[segs.length - 1]).trim();

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const link = document.createElement('a');
  link.href = listingHref;
  link.textContent = 'Adventures';
  nav.innerHTML = `
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item"></li>
      <li class="breadcrumb-item breadcrumb-current" aria-current="page">${title}</li>
    </ol>`;
  nav.querySelector('.breadcrumb-item').append(link);
  section.prepend(nav);
}

/**
 * Restructures a magazine article page to match the source layout: a full-width
 * head (hero, breadcrumb, title, byline) followed by a two-column body — the
 * article on the left and a sidebar (Share / Download PDF / recent stories) on
 * the right. The migrated content arrives as one flat default-content blob, so
 * the split is done here rather than in the authored document.
 * @param {Element} main The main container element
 */
function decorateMagazineArticle(main) {
  const segs = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '').split('/').filter(Boolean);
  const magIdx = segs.indexOf('magazine');
  // article pages only: exactly one slug after the "magazine" listing segment
  if (magIdx === -1 || magIdx !== segs.length - 2) return;

  const section = main.querySelector('.section');
  const wrapper = section && section.querySelector('.default-content-wrapper');
  if (!wrapper || section.classList.contains('magazine-article-page')) return;
  section.classList.add('magazine-article-page');

  // 1. Restyle the authored breadcrumb <ol> (Magazine / <title>) as a nav.
  const bcList = [...wrapper.children].find(
    (el) => el.tagName === 'OL' && el.querySelector('a[href*="/magazine"]'),
  );
  if (bcList) {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.className = 'breadcrumb-list';
    const items = [...bcList.children];
    items.forEach((li, i) => {
      const item = document.createElement('li');
      item.className = 'breadcrumb-item';
      if (i === items.length - 1) {
        item.classList.add('breadcrumb-current');
        item.setAttribute('aria-current', 'page');
      }
      item.append(...li.childNodes);
      ol.append(item);
    });
    nav.append(ol);
    bcList.replaceWith(nav);
  }

  // 2. Wrap the quote (blockquote + attribution) in a grey box.
  const blockquote = wrapper.querySelector('blockquote');
  if (blockquote && !blockquote.closest('.magazine-quote')) {
    const quote = document.createElement('div');
    quote.className = 'magazine-quote';
    blockquote.replaceWith(quote);
    quote.append(blockquote);
    const attribution = quote.nextElementSibling;
    if (attribution && attribution.tagName === 'P' && attribution.querySelector('u')) {
      quote.append(attribution);
    }
  }

  // 3. Split the body: everything from "Share this Story" onward is the sidebar;
  //    the head elements (hero image, breadcrumb, title, byline) stay full-width.
  const liveKids = [...wrapper.children];
  const shareEl = liveKids.find(
    (el) => /^H\d$/.test(el.tagName) && /share this story/i.test(el.textContent),
  );
  const shareIdx = shareEl ? liveKids.indexOf(shareEl) : -1;

  const head = new Set();
  const heroP = liveKids.find((el) => el.tagName === 'P' && el.querySelector('picture'));
  if (heroP) head.add(heroP);
  const bcNav = wrapper.querySelector('nav.breadcrumb');
  if (bcNav) head.add(bcNav);
  const title = wrapper.querySelector('h1');
  if (title) head.add(title);
  const byline = title && title.nextElementSibling && title.nextElementSibling.tagName === 'H4'
    ? title.nextElementSibling : null;
  if (byline) head.add(byline);

  const article = document.createElement('div');
  article.className = 'magazine-article';
  const aside = document.createElement('div');
  aside.className = 'magazine-aside';

  liveKids.forEach((el, i) => {
    if (head.has(el)) return; // leave in place, full-width
    if (shareIdx !== -1 && i >= shareIdx) aside.append(el);
    else article.append(el);
  });
  if (article.childElementCount) wrapper.append(article);
  if (aside.childElementCount) wrapper.append(aside);

  // 4. Split each recent-story link into an uppercase title + a muted date so
  //    the sidebar nav matches the source (capitalised text, yellow hover).
  aside.querySelectorAll('ul a').forEach((a) => {
    if (!/\/magazine\//.test(a.getAttribute('href') || '')) return;
    const text = a.textContent.trim();
    const m = text.match(/\s+((?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day,\s+.+)$/);
    a.textContent = '';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'magazine-recent-title';
    titleSpan.textContent = m ? text.slice(0, m.index).trim() : text;
    a.append(titleSpan);
    if (m) {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'magazine-recent-date';
      dateSpan.textContent = m[1].trim();
      a.append(dateSpan);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  buildBreadcrumb(main);
  decorateMagazineArticle(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
