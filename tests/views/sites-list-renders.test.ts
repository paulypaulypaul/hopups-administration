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

describe("SitesView listing", () => {
  afterEach(() => vi.clearAllMocks());

  it("fetches and renders each site's name with links to hopups/phone-pool/analytics", async () => {
    const router = createTestRouter();
    router.push("/");
    await router.isReady();

    const wrapper = mountWithPlugins(SitesView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('[data-testid="site-name"]').text()).toBe("Coats N Stuff");
    const links = wrapper.findAll("a").map((a) => a.text());
    expect(links).toEqual(expect.arrayContaining(["Hopups", "Phone pool", "Analytics"]));
  });
});
