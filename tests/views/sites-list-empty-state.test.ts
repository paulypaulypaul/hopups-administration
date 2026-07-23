import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import SitesView from "../../src/views/SitesView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => []),
  createSite: vi.fn(),
  renameSite: vi.fn(),
  deleteSite: vi.fn()
}));

describe("SitesView with no sites", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders an empty state rather than an error", async () => {
    const router = createTestRouter();
    router.push("/");
    await router.isReady();

    const wrapper = mountWithPlugins(SitesView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
  });
});
