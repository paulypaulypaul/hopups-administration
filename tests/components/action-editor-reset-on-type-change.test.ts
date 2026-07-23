import { describe, expect, it } from "vitest";
import ActionEditor from "../../src/components/ActionEditor.vue";
import { mountWithPlugins } from "../helpers/mount";

describe("ActionEditor reset on type change", () => {
  it("resets the payload to the new type's empty shape rather than carrying over old fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "modal", payload: { title: "Hi", body: "Welcome" } } }
    });
    const vm = wrapper.vm as unknown as { setType: (type: string) => void };

    vm.setType("banner");

    const emitted = wrapper.emitted("update:modelValue");
    const lastEmission = emitted![emitted!.length - 1][0] as { type: string; payload: Record<string, unknown> };
    expect(lastEmission.type).toBe("banner");
    expect(lastEmission.payload).toEqual({ message: "", ctaLabel: "", ctaUrl: "" });
    expect(lastEmission.payload.title).toBeUndefined();
  });
});
