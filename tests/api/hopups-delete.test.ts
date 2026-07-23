import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteHopup } from "../../src/api/hopups";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("deleteHopup", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("calls DELETE /api/admin/hopups/:id", async () => {
    const fetchSpy = mockFetchOnce(204, undefined);

    await deleteHopup("hopup-1");

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/hopups/hopup-1");
    expect((init as RequestInit).method).toBe("DELETE");
  });
});
