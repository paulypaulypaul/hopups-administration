import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import HopupsView from "../../src/views/HopupsView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/hopups", () => ({
  listHopups: vi.fn(async () => [
    {
      id: "hopup-1",
      siteId: "site-1",
      active: true,
      repeatAllowance: 2,
      conditions: [{ signal: "page.path", operator: "eq", value: "/jackets" }],
      actions: [{ id: "action-1", hopupId: "hopup-1", type: "banner", payload: { message: "hi" } }]
    }
  ]),
  createHopup: vi.fn(),
  updateHopup: vi.fn(),
  deleteHopup: vi.fn()
}));

describe("HopupsView listing", () => {
  afterEach(() => vi.clearAllMocks());

  it("shows each hopup's active state, repeat allowance, condition count, and action count", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/hopups");
    await router.isReady();

    const wrapper = mountWithPlugins(HopupsView, { props: { siteId: "site-1" }, global: { plugins: [router] } });
    await flushPromises();

    const row = wrapper.find('[data-testid="hopup-row"]');
    expect(row.text()).toContain("Active");
    expect(row.text()).toContain("Repeat allowance: 2");
    expect(row.text()).toContain("1 condition(s)");
    expect(row.text()).toContain("1 action(s)");
  });
});
