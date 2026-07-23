import { afterEach, describe, expect, it, vi } from "vitest";
import { renameSite } from "../../src/api/sites";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("renameSite", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("calls PUT /api/admin/sites/:id with the updated name", async () => {
    const fetchSpy = mockFetchOnce(200, {
      id: "site-1",
      name: "New Name",
      defaultNumber: null,
      createdAt: "2026-01-01T00:00:00Z"
    });

    const result = await renameSite("site-1", "New Name");

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/sites/site-1");
    expect((init as RequestInit).method).toBe("PUT");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ name: "New Name" });
    expect(result.name).toBe("New Name");
  });
});
