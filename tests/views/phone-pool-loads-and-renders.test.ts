import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import PhonePoolView from "../../src/views/PhonePoolView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { createTestRouter } from "../helpers/testRouter";

vi.mock("../../src/api/phonePool", () => ({
  getPhonePool: vi.fn(async () => ({ numbers: ["+1-555-0001", "+1-555-0002"], defaultNumber: "+1-555-9999" })),
  updatePhonePool: vi.fn()
}));

describe("PhonePoolView", () => {
  afterEach(() => vi.clearAllMocks());

  it("fetches and renders the number list and default number", async () => {
    const router = createTestRouter();
    router.push("/sites/site-1/phone-pool");
    await router.isReady();

    const wrapper = mountWithPlugins(PhonePoolView, { props: { siteId: "site-1" }, global: { plugins: [router] } });
    await flushPromises();

    const rows = wrapper.findAll('[data-testid="pool-number-row"]');
    expect(rows).toHaveLength(2);
    expect(rows[0].text()).toContain("+1-555-0001");

    const defaultNumberInput = wrapper.find('[data-testid="default-number"]');
    expect((defaultNumberInput.element as HTMLInputElement).value).toBe("+1-555-9999");
  });
});
