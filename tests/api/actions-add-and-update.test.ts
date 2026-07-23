import { afterEach, describe, expect, it, vi } from "vitest";
import { addAction, updateAction } from "../../src/api/actions";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("actions API", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("addAction POSTs to /api/admin/hopups/:hopupId/actions", async () => {
    const fetchSpy = mockFetchOnce(201, { id: "action-2", hopupId: "hopup-1", type: "banner", payload: { message: "hi" } });

    await addAction("hopup-1", "banner", { message: "hi" });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/hopups/hopup-1/actions");
    expect((init as RequestInit).method).toBe("POST");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ type: "banner", payload: { message: "hi" } });
  });

  it("updateAction PUTs to /api/admin/actions/:id", async () => {
    const fetchSpy = mockFetchOnce(200, { id: "action-1", hopupId: "hopup-1", type: "banner", payload: { message: "updated" } });

    await updateAction("action-1", { payload: { message: "updated" } });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/actions/action-1");
    expect((init as RequestInit).method).toBe("PUT");
  });
});
