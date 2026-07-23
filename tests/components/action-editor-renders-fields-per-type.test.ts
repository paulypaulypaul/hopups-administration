import { describe, expect, it } from "vitest";
import ActionEditor from "../../src/components/ActionEditor.vue";
import { mountWithPlugins } from "../helpers/mount";

describe("ActionEditor field rendering per type", () => {
  it("renders modal fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "modal", payload: { title: "", body: "", ctaLabel: "", ctaUrl: "" } } }
    });
    expect(wrapper.find('[data-testid="field-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="field-body"]').exists()).toBe(true);
  });

  it("renders banner fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "banner", payload: { message: "" } } }
    });
    expect(wrapper.find('[data-testid="field-message"]').exists()).toBe(true);
  });

  it("renders phoneNumberSwap fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "phoneNumberSwap", payload: { selector: "" } } }
    });
    expect(wrapper.find('[data-testid="field-selector"]').exists()).toBe(true);
  });

  it("renders redirect fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "redirect", payload: { url: "" } } }
    });
    expect(wrapper.find('[data-testid="field-url"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="field-delayMs"]').exists()).toBe(true);
  });

  it("renders customHtml fields", () => {
    const wrapper = mountWithPlugins(ActionEditor, {
      props: { modelValue: { type: "customHtml", payload: { html: "" } } }
    });
    expect(wrapper.find('[data-testid="field-html"]').exists()).toBe(true);
  });
});
