---
name: Phone Pool Management
description: View and edit a site's call-tracking number pool and default/fallback number
targets:
  - ../src/views/PhonePoolView.vue
  - ../src/api/phonePool.ts
---

# Phone Pool Management

Manages the per-site call-tracking number pool described in `hopups-server`'s
`phone-allocation.spec.md`. This screen didn't exist in the original console; it's new in this
reimplementation since the backend gained self-managed number pools.

```typescript
interface PhonePool {
  numbers: string[];
  defaultNumber: string | null;
}

function getPhonePool(siteId: string): Promise<PhonePool>;
function updatePhonePool(siteId: string, pool: PhonePool): Promise<PhonePool>;
```

## Viewing

- On load, fetches `GET /api/admin/sites/:siteId/phone-pool` and renders the number list and the
  default number field.
  `[@test] ../tests/views/phone-pool-loads-and-renders.test.ts`

## Editing

- Numbers can be added and removed as free-text rows; the list may be saved empty.
  `[@test] ../tests/components/phone-pool-add-remove-numbers.test.ts`
- The default number field is optional/clearable — saving with it blank sends `defaultNumber: null`.
  `[@test] ../tests/api/phone-pool-save-null-default.test.ts`
- Saving calls `PUT /api/admin/sites/:siteId/phone-pool` with the full `numbers` array and
  `defaultNumber`, then shows a success confirmation.
  `[@test] ../tests/api/phone-pool-save.test.ts`
