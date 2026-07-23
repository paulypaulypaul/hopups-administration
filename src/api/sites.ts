import { apiRequest } from "./client";

export interface Site {
  id: string;
  name: string;
  defaultNumber: string | null;
  createdAt: string;
}

export function listSites(): Promise<Site[]> {
  return apiRequest<Site[]>("/api/admin/sites");
}

export function createSite(name: string): Promise<Site> {
  return apiRequest<Site>("/api/admin/sites", { method: "POST", body: { name } });
}

export function renameSite(id: string, name: string): Promise<Site> {
  return apiRequest<Site>(`/api/admin/sites/${id}`, { method: "PUT", body: { name } });
}

export function deleteSite(id: string): Promise<void> {
  return apiRequest<void>(`/api/admin/sites/${id}`, { method: "DELETE" });
}
