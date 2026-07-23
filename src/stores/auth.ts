import { defineStore } from "pinia";
import { apiRequest } from "../api/client";

const STORAGE_KEY = "hopups_admin_auth";

interface StoredAuth {
  token: string;
  expiresAt: string;
}

function loadStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    const stored = loadStoredAuth();
    return {
      token: stored?.token ?? null,
      expiresAt: stored?.expiresAt ?? null
    } as { token: string | null; expiresAt: string | null };
  },
  getters: {
    isAuthenticated(state): boolean {
      if (!state.token || !state.expiresAt) {
        return false;
      }
      return new Date(state.expiresAt).getTime() > Date.now();
    }
  },
  actions: {
    async login(username: string, password: string): Promise<void> {
      const result = await apiRequest<StoredAuth>("/api/admin/login", {
        method: "POST",
        body: { username, password },
        auth: false
      });
      this.token = result.token;
      this.expiresAt = result.expiresAt;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    },
    logout(): void {
      this.token = null;
      this.expiresAt = null;
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});
