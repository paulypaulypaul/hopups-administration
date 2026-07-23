import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("auth store login", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores the token and expiresAt returned by POST /api/admin/login", async () => {
    mockFetchOnce(200, { token: "jwt-token", expiresAt: "2026-08-01T00:00:00Z" });
    const auth = useAuthStore();

    await auth.login("admin", "secret");

    expect(auth.token).toBe("jwt-token");
    expect(auth.expiresAt).toBe("2026-08-01T00:00:00Z");
    expect(localStorage.getItem("hopups_admin_auth")).toContain("jwt-token");
  });
});
