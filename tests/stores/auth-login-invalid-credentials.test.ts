import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("auth store login with invalid credentials", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("throws and stores no token on 401", async () => {
    mockFetchOnce(401, { error: "Invalid credentials" });
    const auth = useAuthStore();

    await expect(auth.login("admin", "wrong")).rejects.toThrow();

    expect(auth.token).toBeNull();
    expect(localStorage.getItem("hopups_admin_auth")).toBeNull();
  });
});
