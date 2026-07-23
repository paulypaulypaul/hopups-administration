import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteSite } from "../../src/api/sites";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("deleteSite", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("calls DELETE /api/admin/sites/:id", async () => {
    const fetchSpy = mockFetchOnce(204, undefined);

    await deleteSite("site-1");

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/sites/site-1");
    expect((init as RequestInit).method).toBe("DELETE");
  });
});
