import { afterEach, describe, expect, it, vi } from "vitest";
import HopupEditor from "../../src/components/HopupEditor.vue";
import { mountWithPlugins } from "../helpers/mount";

vi.mock("../../src/api/hopups", () => ({
  createHopup: vi.fn(async () => ({
    id: "hopup-1",
    siteId: "site-1",
    active: true,
    conditions: [],
    repeatAllowance: 1,
    actions: []
  })),
  updateHopup: vi.fn()
}));
vi.mock("../../src/api/actions", () => ({
  addAction: vi.fn(),
  updateAction: vi.fn(),
  deleteAction: vi.fn()
}));

describe("HopupEditor create mode", () => {
  afterEach(() => vi.clearAllMocks());

  it("keeps the submit control disabled until at least one action is added", async () => {
    const wrapper = mountWithPlugins(HopupEditor, { props: { siteId: "site-1" } });

    expect(wrapper.find('[data-testid="submit-create"]').attributes("disabled")).toBeDefined();

    await wrapper.find('[data-testid="add-draft-action"]').trigger("click");

    expect(wrapper.find('[data-testid="submit-create"]').attributes("disabled")).toBeUndefined();
  });
});
