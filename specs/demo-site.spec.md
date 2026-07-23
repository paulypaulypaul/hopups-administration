---
name: Demo Site
description: An in-app preview page that embeds the real widget against a live site, for demoing/debugging
targets:
  - ../src/views/DemoSiteView.vue
  - ../public/demo-site.html
---

# Demo Site

`/demo-site` lets an admin see the widget actually working — a mock "customer website" rendered in
an iframe with the real `hopups-server` widget loader embedded, running against a real site's data.
This didn't exist in the original console; it replaces manually building a throwaway HTML file to
test changes.

```typescript
function pickDemoSite(sites: Site[]): Site | null; // prefers a site named "Coats N Stuff", else the first site
```

## Site selection

- On load, the page fetches the site list and preselects the site named `"Coats N Stuff"` if one
  exists, falling back to the first site in the list otherwise.
  `[@test] ../tests/views/demo-site-picks-named-site.test.ts`
  `[@test] ../tests/views/demo-site-falls-back-to-first-site.test.ts`
- When more than one site exists, a selector lets the admin switch which site's widget is being
  previewed.
  `[@test] ../tests/views/demo-site-selector-switches-site.test.ts`
- When no sites exist at all, an empty state is shown instead of an iframe.
  `[@test] ../tests/views/demo-site-empty-state-when-no-sites.test.ts`

## Embedding

- The preview renders in an `<iframe>` pointed at the static `demo-site.html` page, with `siteId`
  and `apiBase` (the configured admin API base URL) passed as query parameters.
  `[@test] ../tests/views/demo-site-iframe-src-includes-site-and-api-base.test.ts`
- `demo-site.html` is a self-contained static page (mock storefront nav + content) that reads those
  query parameters and injects `<script data-site-id="..." src="{apiBase}/widget/loader.js">`,
  exercising the exact same loader real customer sites use.
