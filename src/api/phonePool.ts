import { apiRequest } from "./client";

export interface PhonePool {
  numbers: string[];
  defaultNumber: string | null;
}

export function getPhonePool(siteId: string): Promise<PhonePool> {
  return apiRequest<PhonePool>(`/api/admin/sites/${siteId}/phone-pool`);
}

export function updatePhonePool(siteId: string, pool: PhonePool): Promise<PhonePool> {
  return apiRequest<PhonePool>(`/api/admin/sites/${siteId}/phone-pool`, { method: "PUT", body: pool });
}
