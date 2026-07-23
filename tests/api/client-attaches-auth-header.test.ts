import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, configureApiClient } from "../../src/api/client";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("apiRequest auth header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("attaches Authorization: Bearer <token> using the currently stored token", async () => {
    configureApiClient({ getToken: () => "abc123", onUnauthorized: vi.fn() });
    const fetchSpy = mockFetchOnce(200, { ok: true });

    await apiRequest("/api/admin/sites");

    const [, requestInit] = fetchSpy.mock.calls[0];
    expect((requestInit as RequestInit).headers).toMatchObject({ Authorization: "Bearer abc123" });
  });
});
