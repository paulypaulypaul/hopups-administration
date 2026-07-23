import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import SitesView from "../../src/views/SitesView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => [
    { id: "site-1", name: "Coats N Stuff", defaultNumber: null, createdAt: "2026-01-01T00:00:00Z" }
  ]),
  createSite: vi.fn(),
  renameSite: vi.fn(),
  deleteSite: vi.fn()
}));

describe("SitesView delete confirmation", () => {
  afterEach(() => vi.clearAllMocks());

  it("shows a confirmation dialog warning about cascading deletes before calling the API", async () => {
    const router = createTestRouter();
    router.push("/");
    await router.isReady();

    const wrapper = mountWithPlugins(SitesView, { global: { plugins: [router] } });
    await flushPromises();

    await wrapper.find('[data-testid="delete-site"]').trigger("click");
    await flushPromises();

    const message = wrapper.find('[data-testid="delete-confirmation-message"]');
    expect(message.exists()).toBe(true);
    expect(message.text()).toContain("Coats N Stuff");
    expect(message.text()).toContain("hopups");
  });
});
