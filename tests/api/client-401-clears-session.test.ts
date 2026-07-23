import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, configureApiClient } from "../../src/api/client";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("apiRequest 401 handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onUnauthorized when the server returns 401", async () => {
    const onUnauthorized = vi.fn();
    configureApiClient({ getToken: () => "expired-token", onUnauthorized });
    mockFetchOnce(401, { error: "Invalid or expired token" });

    await expect(apiRequest("/api/admin/sites")).rejects.toThrow();

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
