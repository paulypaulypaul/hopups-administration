---
name: Analytics Dashboard
description: Per-site rollup chart and raw event table, filterable by hopup and date range
targets:
  - ../src/views/AnalyticsView.vue
  - ../src/api/analytics.ts
---

# Analytics Dashboard

Reads from `hopups-server`'s analytics endpoints (`analytics.spec.md`), replacing the original's
hopup chart page.

```typescript
type RollupInterval = "minute" | "hour" | "day";

interface ActionEvent {
  id: string;
  siteId: string;
  hopupId: string;
  actionId: string;
  visitorId: string;
  sessionId: string;
  shownAt: string;
}

interface RollupBucket {
  siteId: string;
  hopupId: string;
  interval: RollupInterval;
  intervalStart: string;
  count: number;
}

function getEvents(filter: { siteId: string; hopupId?: string; from?: string; to?: string }): Promise<ActionEvent[]>;
function getRollups(filter: { siteId: string; hopupId?: string; from?: string; to?: string; interval?: RollupInterval }): Promise<RollupBucket[]>;
```

## Filters

- The dashboard has an optional hopup filter (dropdown of the site's hopups, "All" by default), a
  from/to date range, and an interval selector (minute/hour/day, defaulting to `hour`) for the chart.
  `[@test] ../tests/views/analytics-filters-trigger-refetch.test.ts`

## Rollup chart

- Fetches `GET /api/admin/analytics/rollups` with the current filters and renders the buckets as a
  time-series chart (count per `intervalStart`).
  `[@test] ../tests/views/analytics-chart-renders-buckets.test.ts`
- No data in range renders an empty state instead of a broken/empty chart.
  `[@test] ../tests/views/analytics-chart-empty-state.test.ts`

## Event table

- Fetches `GET /api/admin/analytics/events` with the same filters and renders each event's hopup,
  action, visitor, session, and timestamp in a table.
  `[@test] ../tests/views/analytics-events-table-renders.test.ts`
