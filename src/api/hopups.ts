import { apiRequest } from "./client";
import type { Action, ActionType } from "./actions";

export type Operator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "matches";

export interface Condition {
  signal: string;
  operator: Operator;
  value: unknown;
}

export interface Hopup {
  id: string;
  siteId: string;
  active: boolean;
  conditions: Condition[];
  repeatAllowance: number;
  actions: Action[];
}

export interface CreateHopupInput {
  active?: boolean;
  conditions: Condition[];
  repeatAllowance?: number;
  actions: { type: ActionType; payload: unknown }[];
}

export function listHopups(siteId: string): Promise<Hopup[]> {
  return apiRequest<Hopup[]>(`/api/admin/sites/${siteId}/hopups`);
}

export function createHopup(siteId: string, data: CreateHopupInput): Promise<Hopup> {
  return apiRequest<Hopup>(`/api/admin/sites/${siteId}/hopups`, { method: "POST", body: data });
}

export function updateHopup(
  id: string,
  data: Partial<Pick<Hopup, "active" | "conditions" | "repeatAllowance">>
): Promise<Hopup> {
  return apiRequest<Hopup>(`/api/admin/hopups/${id}`, { method: "PUT", body: data });
}

export function deleteHopup(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/hopups/${id}`, { method: "DELETE" });
}
