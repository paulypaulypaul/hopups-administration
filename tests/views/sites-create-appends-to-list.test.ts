import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import SitesView from "../../src/views/SitesView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

const createSiteMock = vi.fn(async (name: string) => ({
  id: "site-new",
  name,
  defaultNumber: null,
  createdAt: "2026-01-01T00:00:00Z"
}));

vi.mock("../../src/api/sites", () => ({
  listSites: vi.fn(async () => []),
  createSite: (name: string) => createSiteMock(name),
  renameSite: vi.fn(),
  deleteSite: vi.fn()
}));

describe("SitesView create", () => {
  afterEach(() => vi.clearAllMocks());

  it("appends the newly created site to the list without a full reload", async () => {
    const router = createTestRouter();
    router.push("/");
    await router.isReady();

    const wrapper = mountWithPlugins(SitesView, { global: { plugins: [router] } });
    await flushPromises();

    (wrapper.vm as unknown as { newSiteName: string }).newSiteName = "Coats N Stuff";
    await (wrapper.vm as unknown as { submitCreate: () => Promise<void> }).submitCreate();
    await flushPromises();

    expect(createSiteMock).toHaveBeenCalledWith("Coats N Stuff");
    expect((wrapper.vm as unknown as { sites: unknown[] }).sites).toHaveLength(1);
  });
});
