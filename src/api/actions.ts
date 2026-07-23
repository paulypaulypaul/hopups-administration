import { apiRequest } from "./client";

export type ActionType = "modal" | "banner" | "phoneNumberSwap" | "redirect" | "customHtml";

export interface Action {
  id: string;
  hopupId: string;
  type: ActionType;
  payload: unknown;
}

export function addAction(hopupId: string, type: ActionType, payload: unknown): Promise<Action> {
  return apiRequest<Action>(`/api/admin/hopups/${hopupId}/actions`, {
    method: "POST",
    body: { type, payload }
  });
}

export function updateAction(id: string, data: { type?: ActionType; payload?: unknown }): Promise<Action> {
  return apiRequest<Action>(`/api/admin/actions/${id}`, { method: "PUT", body: data });
}

export function deleteAction(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/actions/${id}`, { method: "DELETE" });
}
