import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import DemoSiteView from "../../src/views/DemoSiteView.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => [
    { id: "site-1", name: "Some Other Site", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" },
    { id: "site-2", name: "Coats N Stuff", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" }
  ])
}));

describe("DemoSiteView site selection", () => {
  afterEach(() => vi.clearAllMocks());

  it("preselects the site named Coats N Stuff when one exists", async () => {
    const wrapper = mountWithPlugins(DemoSiteView);
    await flushPromises();

    expect((wrapper.vm as unknown as { selectedSiteId: string }).selectedSiteId).toBe("site-2");
  });
});
