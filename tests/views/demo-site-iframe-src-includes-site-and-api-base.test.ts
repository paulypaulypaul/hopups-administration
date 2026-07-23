import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import DemoSiteView from "../../src/views/DemoSiteView.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => [
    { id: "site-1", name: "Coats N Stuff", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" }
  ])
}));

describe("DemoSiteView iframe embedding", () => {
  afterEach(() => vi.clearAllMocks());

  it("points the iframe at demo-site.html with siteId and apiBase query params", async () => {
    const wrapper = mountWithPlugins(DemoSiteView);
    await flushPromises();

    const src = wrapper.find('[data-testid="demo-site-frame"]').attributes("src")!;
    expect(src).toContain("/demo-site.html?");
    expect(src).toContain("siteId=site-1");
    expect(src).toContain("apiBase=");
  });
});
