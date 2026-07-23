import { apiRequest } from "./client";

export type RollupInterval = "minute" | "hour" | "day";

export interface ActionEvent {
  id: string;
  siteId: string;
  hopupId: string;
  actionId: string;
  visitorId: string;
  sessionId: string;
  shownAt: string;
}

export interface RollupBucket {
  siteId: string;
  hopupId: string;
  interval: RollupInterval;
  intervalStart: string;
  count: number;
}

export interface AnalyticsFilter {
  siteId: string;
  hopupId?: string;
  from?: string;
  to?: string;
}

function buildQuery(filter: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function getEvents(filter: AnalyticsFilter): Promise<ActionEvent[]> {
  return apiRequest<ActionEvent[]>(`/api/admin/analytics/events${buildQuery(filter)}`);
}

export function getRollups(filter: AnalyticsFilter & { interval?: RollupInterval }): Promise<RollupBucket[]> {
  return apiRequest<RollupBucket[]>(`/api/admin/analytics/rollups${buildQuery(filter)}`);
}
