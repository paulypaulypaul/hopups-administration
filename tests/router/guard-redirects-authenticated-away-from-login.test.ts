import { describe, expect, it } from "vitest";
import { resolveGuardRedirect } from "../../src/router/index";

describe("resolveGuardRedirect when authenticated", () => {
  it("redirects away from login to sites", () => {
    expect(resolveGuardRedirect("login", true)).toBe("sites");
  });

  it("does not redirect for other routes", () => {
    expect(resolveGuardRedirect("sites", true)).toBeNull();
    expect(resolveGuardRedirect("hopups", true)).toBeNull();
  });
});
