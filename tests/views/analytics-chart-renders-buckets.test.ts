import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import AnalyticsView from "../../src/views/AnalyticsView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/analytics", () => ({
  getEvents: vi.fn(async () => []),
  getRollups: vi.fn(async () => [
    { siteId: "site-1", hopupId: "hopup-1", interval: "hour", intervalStart: "2026-01-01T10:00:00Z", count: 3 }
  ])
}));
vi.mock("../../src/api/hopups", () => ({
  listHopups: vi.fn(async () => [])
}));

const ChartStub = {
  props: ["data"],
  template: '<div data-testid="rollup-chart" :data-json="JSON.stringify(data)" />'
};

describe("AnalyticsView rollup chart", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders the fetched rollup buckets as chart data", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/analytics");
    await router.isReady();

    const wrapper = mountWithPlugins(AnalyticsView, {
      props: { siteId: "site-1" },
      global: { components: { Chart: ChartStub }, plugins: [router] }
    });
    await flushPromises();

    const chart = wrapper.find('[data-testid="rollup-chart"]');
    const data = JSON.parse(chart.attributes("data-json")!);
    expect(data.datasets[0].data).toEqual([3]);
    expect(data.labels).toEqual(["2026-01-01T10:00:00Z"]);
  });
});
