import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import { i18n } from "@/i18n.js";
import ToolLayout from "./ToolLayout.vue";

const toolsApi = vi.hoisted(() => ({
  listFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  listRecent: vi.fn(),
  trackRecent: vi.fn(),
}));

vi.mock("@/services/tools.js", () => ({ toolsApi }));

function mountLayout() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return mount(ToolLayout, {
    props: { toolId: "uuid", icon: "pi-sparkles", description: "desc" },
    slots: { default: "<p data-test='body'>body</p>" },
    global: {
      plugins: [[VueQueryPlugin, { queryClient }], PrimeVue, i18n],
      stubs: { RouterLink: { template: "<a><slot /></a>" } },
    },
  });
}

describe("ToolLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    toolsApi.listFavorites.mockResolvedValue([]);
    toolsApi.listRecent.mockResolvedValue([]);
    toolsApi.addFavorite.mockResolvedValue(undefined);
    toolsApi.removeFavorite.mockResolvedValue(undefined);
    toolsApi.trackRecent.mockResolvedValue(undefined);
  });

  it("tracks the tool use once on mount", async () => {
    mountLayout();
    await flushPromises();

    expect(toolsApi.trackRecent).toHaveBeenCalledTimes(1);
    expect(toolsApi.trackRecent.mock.calls[0]?.[0]).toBe("uuid");
  });

  it("does not break the tool when tracking fails", async () => {
    toolsApi.trackRecent.mockRejectedValue(new Error("network"));
    const wrapper = mountLayout();
    await flushPromises();

    expect(wrapper.find("[data-test='body']").exists()).toBe(true);
  });

  it("adds the favorite when the star is clicked", async () => {
    const wrapper = mountLayout();
    await flushPromises();

    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(toolsApi.addFavorite.mock.calls[0]?.[0]).toBe("uuid");
  });

  it("removes the favorite when it is already starred", async () => {
    toolsApi.listFavorites.mockResolvedValue(["uuid"]);
    const wrapper = mountLayout();
    await flushPromises();

    expect(wrapper.find("button").attributes("aria-pressed")).toBe("true");
    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(toolsApi.removeFavorite.mock.calls[0]?.[0]).toBe("uuid");
  });
});
