---
name: Sites Management
description: List, create, rename, and delete sites via the admin API
targets:
  - ../src/views/SitesView.vue
  - ../src/api/sites.ts
---

# Sites Management

Sites are the top-level entity every other screen (hopups, phone pool, analytics) is scoped to.
This screen is the landing page after login.

```typescript
interface Site {
  id: string;
  name: string;
  defaultNumber: string | null;
  createdAt: string;
}

function listSites(): Promise<Site[]>;
function createSite(name: string): Promise<Site>;
function renameSite(id: string, name: string): Promise<Site>;
function deleteSite(id: string): Promise<void>;
```

## Listing

- On load, the sites view fetches `GET /api/admin/sites` and renders each site's name with links
  through to its hopups, phone pool, and analytics screens.
  `[@test] ../tests/views/sites-list-renders.test.ts`
- An empty list renders an empty state rather than an error.
  `[@test] ../tests/views/sites-list-empty-state.test.ts`

## Create

- Creating a site only requires a `name`; `defaultNumber` is not set here — it's managed
  exclusively on the phone pool screen (see `phone-pool-management.spec.md`) to keep one source of
  truth in the UI, even though the underlying API also accepts it on the site resource.
  `[@test] ../tests/api/sites-create-sends-name-only.test.ts`
- On success, the new site appears in the list without a full page reload.
  `[@test] ../tests/views/sites-create-appends-to-list.test.ts`

## Rename

- Editing a site's name calls `PUT /api/admin/sites/:id` with the updated `name` and updates the
  list in place.
  `[@test] ../tests/api/sites-rename.test.ts`

## Delete

- Deleting a site shows a confirmation dialog warning that its hopups, actions, and phone pool will
  also be removed (matching the server's cascading delete).
  `[@test] ../tests/views/sites-delete-confirmation.test.ts`
- Confirming calls `DELETE /api/admin/sites/:id` and removes the site from the list.
  `[@test] ../tests/api/sites-delete.test.ts`
