# WKND Site Scope Report Plan

## Objective

Perform a full **site scope analysis** of `https://wknd.site/us/en.html` and produce a migration scope report that inventories WKND's:
- **Pages** (URLs discovered across the site)
- **Templates** (page types, grouping similar pages)
- **Block variants** (the block palette needed to author those pages)

## Approach

This maps directly to the `excat-site-scope` capability, which chains: URL discovery → page analysis → template cataloging → block inventory → scope report generation. Execution will run that workflow end-to-end against the target site.

## Scope Target
- **Entry URL:** `https://wknd.site/us/en.html`
- **Discovery:** sitemap-first, falling back to crawl if no sitemap is available
- **Depth:** full site under the `/us/en` locale (adjust if discovery surfaces other locales)

## Checklist

- [ ] Confirm the entry URL is reachable and identify how URLs will be discovered (sitemap vs. crawl)
- [ ] Discover the full list of site URLs (via sitemap or crawl)
- [ ] Analyze representative pages to identify content structure and sections
- [ ] Catalog page **templates** — group similar pages into distinct page types
- [ ] Inventory **block variants** used across the templates
- [ ] Tally the full **page** inventory and map each page to its template
- [ ] Generate the consolidated **site scope report** (pages + templates + block variants)
- [ ] Summarize findings: counts of pages, templates, and block variants, plus any notable observations

## Notes
- The site scope workflow (`excat-site-scope`) owns the task list during execution and will drive URL discovery, page/template cataloging, and block inventory as sub-steps.
- No content is imported or modified in this task — it is a **read-only discovery and reporting** exercise.
- **Execution requires Execute mode.** Plan mode blocks the network discovery and analysis steps needed to build the report. Approve the plan / switch to Execute mode and I'll run the scope workflow end to end.
