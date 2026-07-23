import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth";

describe("auth store isAuthenticated", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("is false when no token is stored", () => {
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(false);
  });

  it("is false when the current time is past expiresAt", () => {
    const auth = useAuthStore();
    auth.token = "abc";
    auth.expiresAt = new Date(Date.now() - 1000).toISOString();
    expect(auth.isAuthenticated).toBe(false);
  });

  it("is true when a token is stored and not yet expired", () => {
    const auth = useAuthStore();
    auth.token = "abc";
    auth.expiresAt = new Date(Date.now() + 60_000).toISOString();
    expect(auth.isAuthenticated).toBe(true);
  });
});
