import { describe, expect, it } from "vitest";
import ConditionBuilder from "../../src/components/ConditionBuilder.vue";
import { mountWithPlugins } from "../helpers/mount";

describe("ConditionBuilder add/remove rows", () => {
  it("adds a new empty row", async () => {
    const wrapper = mountWithPlugins(ConditionBuilder, { props: { modelValue: [] } });

    await wrapper.find('[data-testid="condition-add"]').trigger("click");

    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted![0][0]).toEqual([{ signal: "", operator: "eq", value: "" }]);
  });

  it("removes a row down to zero conditions", async () => {
    const wrapper = mountWithPlugins(ConditionBuilder, {
      props: { modelValue: [{ signal: "page.path", operator: "eq", value: "/x" }] }
    });

    await wrapper.find('[data-testid="condition-remove"]').trigger("click");

    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted![0][0]).toEqual([]);
  });
});
