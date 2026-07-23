import { afterEach, describe, expect, it, vi } from "vitest";
import { createHopup } from "../../src/api/hopups";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("createHopup", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs conditions, repeatAllowance, and the full actions array", async () => {
    const fetchSpy = mockFetchOnce(201, {
      id: "hopup-1",
      siteId: "site-1",
      active: true,
      conditions: [],
      repeatAllowance: 1,
      actions: [{ id: "action-1", hopupId: "hopup-1", type: "banner", payload: { message: "hi" } }]
    });

    await createHopup("site-1", {
      conditions: [{ signal: "page.path", operator: "eq", value: "/jackets" }],
      repeatAllowance: 1,
      actions: [{ type: "banner", payload: { message: "hi" } }]
    });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/sites/site-1/hopups");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.conditions).toHaveLength(1);
    expect(body.actions).toEqual([{ type: "banner", payload: { message: "hi" } }]);
  });
});
