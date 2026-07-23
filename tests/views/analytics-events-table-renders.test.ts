import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import AnalyticsView from "../../src/views/AnalyticsView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/analytics", () => ({
  getEvents: vi.fn(async () => [
    {
      id: "evt-1",
      siteId: "site-1",
      hopupId: "hopup-1",
      actionId: "action-1",
      visitorId: "visitor-1",
      sessionId: "session-1",
      shownAt: "2026-01-01T10:00:00Z"
    }
  ]),
  getRollups: vi.fn(async () => [])
}));
vi.mock("../../src/api/hopups", () => ({
  listHopups: vi.fn(async () => [])
}));

describe("AnalyticsView events table", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders each event's hopup, action, visitor, session, and timestamp", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/analytics");
    await router.isReady();

    const wrapper = mountWithPlugins(AnalyticsView, { props: { siteId: "site-1" }, global: { plugins: [router] } });
    await flushPromises();

    const row = wrapper.find('[data-testid="event-row"]');
    expect(row.text()).toContain("hopup-1");
    expect(row.text()).toContain("action-1");
    expect(row.text()).toContain("visitor-1");
    expect(row.text()).toContain("session-1");
    expect(row.text()).toContain("2026-01-01T10:00:00Z");
  });
});
