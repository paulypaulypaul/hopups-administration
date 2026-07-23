import { describe, expect, it } from "vitest";
import ConditionBuilder from "../../src/components/ConditionBuilder.vue";
import { mountWithPlugins } from "../helpers/mount";

describe("ConditionBuilder value parsing", () => {
  it("parses JSON-like input as numbers/booleans and falls back to a raw string otherwise", () => {
    const wrapper = mountWithPlugins(ConditionBuilder, {
      props: { modelValue: [{ signal: "visit.count", operator: "eq", value: "" }] }
    });
    const vm = wrapper.vm as unknown as { parseValue: (raw: string) => unknown };

    expect(vm.parseValue("5")).toBe(5);
    expect(vm.parseValue("true")).toBe(true);
    expect(vm.parseValue('["a","b"]')).toEqual(["a", "b"]);
    expect(vm.parseValue("hello")).toBe("hello");
  });

  it("emits the parsed value when the value field changes", async () => {
    const wrapper = mountWithPlugins(ConditionBuilder, {
      props: { modelValue: [{ signal: "visit.count", operator: "eq", value: "" }] }
    });

    await wrapper.find('[data-testid="condition-value"]').setValue("5");

    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    const lastEmission = emitted![emitted!.length - 1][0] as { value: unknown }[];
    expect(lastEmission[0].value).toBe(5);
  });
});
