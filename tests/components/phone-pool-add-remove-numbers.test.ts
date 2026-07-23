import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import PhonePoolView from "../../src/views/PhonePoolView.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/phonePool", () => ({
  getPhonePool: vi.fn(async () => ({ numbers: [], defaultNumber: null })),
  updatePhonePool: vi.fn()
}));

describe("PhonePoolView add/remove numbers", () => {
  afterEach(() => vi.clearAllMocks());

  it("adds a number as a free-text row", async () => {
    const wrapper = mountWithPlugins(PhonePoolView, { props: { siteId: "site-1" } });
    await flushPromises();

    await wrapper.find('[data-testid="new-number"]').setValue("+1-555-0100");
    await wrapper.find('[data-testid="add-number"]').trigger("click");

    expect(wrapper.findAll('[data-testid="pool-number-row"]')).toHaveLength(1);
  });

  it("removes a number down to an empty, saveable list", async () => {
    const wrapper = mountWithPlugins(PhonePoolView, { props: { siteId: "site-1" } });
    await flushPromises();

    await wrapper.find('[data-testid="new-number"]').setValue("+1-555-0100");
    await wrapper.find('[data-testid="add-number"]').trigger("click");
    await wrapper.find('[data-testid="pool-number-row"] button').trigger("click");

    expect(wrapper.findAll('[data-testid="pool-number-row"]')).toHaveLength(0);
  });
});
