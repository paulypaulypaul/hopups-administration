import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import AnalyticsView from "../../src/views/AnalyticsView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/analytics", () => ({
  getEvents: vi.fn(async () => []),
  getRollups: vi.fn(async () => [])
}));
vi.mock("../../src/api/hopups", () => ({
  listHopups: vi.fn(async () => [])
}));

describe("AnalyticsView with no data in range", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders an empty state instead of a broken/empty chart", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/analytics");
    await router.isReady();

    const wrapper = mountWithPlugins(AnalyticsView, { props: { siteId: "site-1" }, global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('[data-testid="chart-empty-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="rollup-chart"]').exists()).toBe(false);
  });
});
