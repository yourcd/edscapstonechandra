/**
 * Adventures category filter.
 *
 * Content model (authored table rows): each row is
 *   | Category label | comma-separated article slugs |
 * The special label "All" (with no slugs, or slugs "*") shows every card.
 *
 * The block renders a horizontal tab bar and filters the sibling
 * `.cards-articles` block: clicking a tab shows only the cards whose link
 * slug is listed for that category; "All" shows everything.
 */

/** slug = last path segment of an href, without extension */
function slugOf(href) {
  try {
    const path = new URL(href, window.location).pathname.replace(/\/$/, '');
    return path.split('/').pop().replace(/\.html?$/, '');
  } catch {
    return '';
  }
}

export default function decorate(block) {
  // 1. Read the authored category → slugs mapping from the block rows.
  const categories = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim();
    if (!label) return;
    const raw = (cells[1]?.textContent || '').trim();
    const all = /^(\*|\(all\)|all)?$/i.test(raw);
    const slugs = all
      ? null
      : new Set(raw.split(',').map((s) => slugOf(s.trim()) || s.trim().toLowerCase()).filter(Boolean));
    categories.push({ label, slugs });
  });
  if (!categories.length) return;

  // 2. Locate the cards grid to filter (nearest .cards-articles in the same
  //    section, else anywhere after this block in main).
  const scope = block.closest('.section') || document.querySelector('main');
  const cards = scope ? scope.querySelector('.cards-articles') : null;

  // 3. Build the tab bar.
  const tablist = document.createElement('ul');
  tablist.className = 'adventures-filter-tabs';

  const applyFilter = (cat) => {
    if (!cards) return;
    cards.querySelectorAll(':scope > ul > li').forEach((li) => {
      const a = li.querySelector('a[href]');
      const slug = a ? slugOf(a.getAttribute('href')) : '';
      const show = !cat.slugs || cat.slugs.has(slug);
      li.style.display = show ? '' : 'none';
    });
  };

  categories.forEach((cat, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adventures-filter-tab';
    btn.textContent = cat.label;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      tablist.querySelectorAll('.adventures-filter-tab').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(cat);
    });
    li.append(btn);
    tablist.append(li);
  });

  block.textContent = '';
  block.append(tablist);

  // 4. Default to the first tab (All).
  applyFilter(categories[0]);
}
