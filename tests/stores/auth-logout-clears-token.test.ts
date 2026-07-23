import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth";

describe("auth store logout", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("clears the stored token, expiresAt, and localStorage entry", () => {
    const auth = useAuthStore();
    auth.token = "abc";
    auth.expiresAt = new Date(Date.now() + 60_000).toISOString();
    localStorage.setItem("hopups_admin_auth", JSON.stringify({ token: "abc", expiresAt: auth.expiresAt }));

    auth.logout();

    expect(auth.token).toBeNull();
    expect(auth.expiresAt).toBeNull();
    expect(localStorage.getItem("hopups_admin_auth")).toBeNull();
  });
});
