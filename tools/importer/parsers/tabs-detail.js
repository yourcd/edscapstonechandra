/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-detail. Base: tabs.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-04
 *
 * Library convention (Tabs): 2 columns, multiple rows. First row = block name.
 * Each subsequent row is one tab: cell 1 = tab label (mandatory), cell 2 = tab
 * content (mandatory).
 *
 * Source structure: div.cmp-tabs > ol.cmp-tabs__tablist (li.cmp-tabs__tab = labels)
 * followed by sibling div.cmp-tabs__tabpanel elements (the bodies). Labels and
 * panels are paired by index. Each panel body is a
 * .contentfragment article (title + paragraphs, an inline image, and lists).
 * Empty aem-Grid wrapper divs and <meta> in the source drop out during the
 * markdown conversion, so the whole article can be passed as the content cell.
 */
export default function parse(element, { document }) {
  const cells = [];

  const tabsRoot = element.querySelector('.cmp-tabs') || element;
  const labels = tabsRoot.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tablist li');
  const panels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  panels.forEach((panel, idx) => {
    const labelEl = labels[idx];
    // Prefer a plain-text label; fall back to the panel index if missing.
    let label = '';
    if (labelEl && labelEl.textContent.trim()) {
      label = labelEl.textContent.trim();
    }

    // Full contentfragment article preserves title, copy, inline image and lists.
    const content = panel.querySelector('.cmp-contentfragment, article, .contentfragment') || panel;

    // A tab requires both a label and content.
    if (!label && !content) return;

    cells.push([label || `Tab ${idx + 1}`, content]);
  });

  // If no tabs were found, unwrap gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-detail', cells });
  element.replaceWith(block);
}
