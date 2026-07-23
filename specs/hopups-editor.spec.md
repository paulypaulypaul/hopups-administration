---
name: Hopups Editor
description: Per-site hopup list, condition/segment builder, and typed action editor
targets:
  - ../src/views/HopupsView.vue
  - ../src/components/HopupEditor.vue
  - ../src/components/ConditionBuilder.vue
  - ../src/components/ActionEditor.vue
  - ../src/api/hopups.ts
  - ../src/api/actions.ts
---

# Hopups Editor

The core CRUD surface for a site's targeting rules, mirroring `hopups-server`'s
`hopups-actions.spec.md` and `rules-engine.spec.md` data model.

```typescript
type Operator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "matches";
interface Condition { signal: string; operator: Operator; value: unknown; }

type ActionType = "modal" | "banner" | "phoneNumberSwap" | "redirect" | "customHtml" | "sidebar";
interface Action { id: string; hopupId: string; type: ActionType; payload: unknown; }

interface Hopup {
  id: string;
  siteId: string;
  active: boolean;
  conditions: Condition[];
  repeatAllowance: number;
  actions: Action[];
}

function listHopups(siteId: string): Promise<Hopup[]>;
function createHopup(siteId: string, data: { active?: boolean; conditions: Condition[]; repeatAllowance?: number; actions: { type: ActionType; payload: unknown }[] }): Promise<Hopup>;
function updateHopup(id: string, data: Partial<Pick<Hopup, "active" | "conditions" | "repeatAllowance">>): Promise<Hopup>;
function deleteHopup(id: string): Promise<void>;
function addAction(hopupId: string, type: ActionType, payload: unknown): Promise<Action>;
function updateAction(id: string, data: { type?: ActionType; payload?: unknown }): Promise<Action>;
function deleteAction(id: string): Promise<void>;
```

## Listing

- The hopups view for a site fetches `GET /api/admin/sites/:siteId/hopups` and shows each hopup's
  active state, repeat allowance, condition count, and action count.
  `[@test] ../tests/views/hopups-list-renders.test.ts`

## Creating a hopup

- The create form requires at least one action before it can be submitted — the server rejects a
  hopup with zero actions, so the submit button stays disabled until one action is added.
  `[@test] ../tests/components/hopup-editor-requires-one-action.test.ts`
- Submitting calls `POST /api/admin/sites/:siteId/hopups` with `conditions`, `repeatAllowance`
  (defaulting to `1` if left blank), and the full `actions` array.
  `[@test] ../tests/api/hopups-create.test.ts`

## Condition builder

- Each condition row has a free-text `signal` field, an `operator` dropdown (the eight operators
  above), and a `value` field. The value field accepts JSON (numbers, booleans, arrays, strings) and
  falls back to a raw string if it doesn't parse as JSON, so both `5` and `"5"` are expressible.
  `[@test] ../tests/components/condition-builder-value-parsing.test.ts`
- Rows can be added and removed freely, including down to zero conditions (a hopup with no
  conditions matches everyone, per the rules engine).
  `[@test] ../tests/components/condition-builder-add-remove-rows.test.ts`

## Action editor

- Selecting an action `type` renders the matching form: modal (`title`, `body`, optional `ctaLabel`/
  `ctaUrl`), banner (`message`, optional `ctaLabel`/`ctaUrl`), phoneNumberSwap (`selector`), redirect
  (`url`, optional `delayMs`), customHtml (`html`), sidebar (`position` — left/right, optional
  `title`, `message`, optional `ctaLabel`/`ctaUrl`).
  `[@test] ../tests/components/action-editor-renders-fields-per-type.test.ts`
- Changing `type` after fields were filled resets the payload to that type's empty shape rather than
  carrying over incompatible fields.
  `[@test] ../tests/components/action-editor-reset-on-type-change.test.ts`
- On an existing hopup, adding an action calls `POST /api/admin/hopups/:hopupId/actions`; editing
  one calls `PUT /api/admin/actions/:id`.
  `[@test] ../tests/api/actions-add-and-update.test.ts`
- The delete control for an action is disabled when it is the hopup's last remaining action,
  preventing the 400 the server would otherwise return.
  `[@test] ../tests/components/hopup-editor-disables-last-action-delete.test.ts`

## Deleting a hopup

- Deleting a hopup shows a confirmation dialog, then calls `DELETE /api/admin/hopups/:id` and
  removes it from the list.
  `[@test] ../tests/api/hopups-delete.test.ts`
