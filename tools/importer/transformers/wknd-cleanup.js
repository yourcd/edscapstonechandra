/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 *
 * Removes non-authorable site chrome and leftover markup so the import
 * contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html (WKND locale-landing DOM).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Header experience fragment (global nav, language nav, sign-in, search).
    // Verified: <header class="experiencefragment cmp-experiencefragment--header"> (cleaned.html:5)
    // Removing before block parsing so its inner nav/search/image do not get
    // picked up by block parsers.
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and tracking artifacts.
    // Verified against cleaned.html:
    //  - footer experience fragment (footer nav, social buttons, copyright) — line 471
    //  - Adobe ID syncing iframe — line 566 (#destination_publishing_iframe_wkndsite_0)
    //  - mobile nav toggle — line 568 (#toggleNav)
    //  - mobile navigation drawer — line 574 (#mobileNav)
    //  - leftover safe elements: iframe, meta (stray <meta> inside cmp-image), noscript, link
    WebImporter.DOMUtils.remove(element, [
      'footer.cmp-experiencefragment--footer',
      '#destination_publishing_iframe_wkndsite_0',
      '#toggleNav',
      '#mobileNav',
      'iframe',
      'noscript',
      'link',
      'meta',
    ]);
  }
}
