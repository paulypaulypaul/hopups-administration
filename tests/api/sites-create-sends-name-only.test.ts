import { afterEach, describe, expect, it, vi } from "vitest";
import { createSite } from "../../src/api/sites";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("createSite", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends only name in the request body", async () => {
    const fetchSpy = mockFetchOnce(201, {
      id: "site-1",
      name: "Coats N Stuff",
      defaultNumber: null,
      createdAt: "2026-01-01T00:00:00Z"
    });

    await createSite("Coats N Stuff");

    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ name: "Coats N Stuff" });
  });
});
