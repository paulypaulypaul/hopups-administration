import { afterEach, describe, expect, it, vi } from "vitest";
import { updatePhonePool } from "../../src/api/phonePool";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("updatePhonePool", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("calls PUT /api/admin/sites/:siteId/phone-pool with numbers and defaultNumber", async () => {
    const fetchSpy = mockFetchOnce(200, { numbers: ["+1-555-0001"], defaultNumber: "+1-555-9999" });

    await updatePhonePool("site-1", { numbers: ["+1-555-0001"], defaultNumber: "+1-555-9999" });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("/api/admin/sites/site-1/phone-pool");
    expect((init as RequestInit).method).toBe("PUT");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      numbers: ["+1-555-0001"],
      defaultNumber: "+1-555-9999"
    });
  });
});
