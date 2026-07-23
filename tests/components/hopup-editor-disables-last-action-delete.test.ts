import { afterEach, describe, expect, it, vi } from "vitest";
import HopupEditor from "../../src/components/HopupEditor.vue";
import { mountWithPlugins } from "../helpers/mount";
import type { Hopup } from "../../src/api/hopups";

vi.mock("../../src/api/hopups", () => ({
  createHopup: vi.fn(),
  updateHopup: vi.fn()
}));
vi.mock("../../src/api/actions", () => ({
  addAction: vi.fn(),
  updateAction: vi.fn(),
  deleteAction: vi.fn()
}));

function makeHopup(actionCount: number): Hopup {
  return {
    id: "hopup-1",
    siteId: "site-1",
    active: true,
    conditions: [],
    repeatAllowance: 1,
    actions: Array.from({ length: actionCount }, (_, i) => ({
      id: `action-${i + 1}`,
      hopupId: "hopup-1",
      type: "banner" as const,
      payload: { message: "hi" }
    }))
  };
}

describe("HopupEditor edit mode action deletion", () => {
  afterEach(() => vi.clearAllMocks());

  it("disables delete when it is the hopup's last remaining action", () => {
    const wrapper = mountWithPlugins(HopupEditor, { props: { siteId: "site-1", existingHopup: makeHopup(1) } });

    expect(wrapper.find('[data-testid="delete-existing-action"]').attributes("disabled")).toBeDefined();
  });

  it("enables delete when more than one action exists", () => {
    const wrapper = mountWithPlugins(HopupEditor, { props: { siteId: "site-1", existingHopup: makeHopup(2) } });

    const deleteButtons = wrapper.findAll('[data-testid="delete-existing-action"]');
    expect(deleteButtons[0].attributes("disabled")).toBeUndefined();
  });
});
