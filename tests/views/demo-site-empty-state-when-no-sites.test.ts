import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import DemoSiteView from "../../src/views/DemoSiteView.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => [])
}));

describe("DemoSiteView with no sites", () => {
  afterEach(() => vi.clearAllMocks());

  it("shows an empty state instead of an iframe", async () => {
    const wrapper = mountWithPlugins(DemoSiteView);
    await flushPromises();

    expect(wrapper.find('[data-testid="demo-site-empty-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="demo-site-frame"]').exists()).toBe(false);
  });
});
