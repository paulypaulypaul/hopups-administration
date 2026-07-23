import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import DemoSiteView from "../../src/views/DemoSiteView.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => [
    { id: "site-1", name: "Coats N Stuff", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" },
    { id: "site-2", name: "Another Site", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" }
  ])
}));

describe("DemoSiteView selector", () => {
  afterEach(() => vi.clearAllMocks());

  it("lets the admin switch which site's widget is being previewed", async () => {
    const wrapper = mountWithPlugins(DemoSiteView);
    await flushPromises();

    const select = wrapper.find('[data-testid="demo-site-selector"]');
    expect(select.exists()).toBe(true);

    await select.setValue("site-2");

    expect((wrapper.vm as unknown as { selectedSiteId: string }).selectedSiteId).toBe("site-2");
    expect(wrapper.find('[data-testid="demo-site-frame"]').attributes("src")).toContain("siteId=site-2");
  });
});
