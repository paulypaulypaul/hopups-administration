import { afterEach, describe, expect, it, vi } from "vitest";
import { updatePhonePool } from "../../src/api/phonePool";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("updatePhonePool with a blank default number", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends defaultNumber: null", async () => {
    const fetchSpy = mockFetchOnce(200, { numbers: [], defaultNumber: null });

    await updatePhonePool("site-1", { numbers: [], defaultNumber: null });

    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ numbers: [], defaultNumber: null });
  });
});
