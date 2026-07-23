import { describe, expect, it } from "vitest";
import { resolveGuardRedirect } from "../../src/router/index";

describe("resolveGuardRedirect when unauthenticated", () => {
  it("redirects to login for any route other than login", () => {
    expect(resolveGuardRedirect("sites", false)).toBe("login");
    expect(resolveGuardRedirect("hopups", false)).toBe("login");
  });

  it("does not redirect when already headed to login", () => {
    expect(resolveGuardRedirect("login", false)).toBeNull();
  });
});
