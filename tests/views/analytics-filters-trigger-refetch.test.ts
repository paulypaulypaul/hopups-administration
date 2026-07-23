import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import AnalyticsView from "../../src/views/AnalyticsView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

const getEventsMock = vi.fn(async () => []);
const getRollupsMock = vi.fn(async () => []);

vi.mock("../../src/api/analytics", () => ({
  getEvents: (...args: unknown[]) => getEventsMock(...args),
  getRollups: (...args: unknown[]) => getRollupsMock(...args)
}));
vi.mock("../../src/api/hopups", () => ({
  listHopups: vi.fn(async () => [])
}));

describe("AnalyticsView filters", () => {
  afterEach(() => vi.clearAllMocks());

  it("refetches events and rollups when a filter changes", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/analytics");
    await router.isReady();

    const wrapper = mountWithPlugins(AnalyticsView, { props: { siteId: "site-1" }, global: { plugins: [router] } });
    await flushPromises();
    getEventsMock.mockClear();
    getRollupsMock.mockClear();

    await wrapper.find('[data-testid="from-filter"]').setValue("2026-01-01T00:00");
    await flushPromises();

    expect(getEventsMock).toHaveBeenCalled();
    expect(getRollupsMock).toHaveBeenCalled();
  });
});
