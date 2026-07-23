import { afterEach, describe, expect, it, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import LoginView from "../../src/views/LoginView.vue";
import { mountWithPlugins } from "../helpers/mount";
import { mockFetchOnce } from "../helpers/fetchMock";

describe("LoginView on successful login", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("redirects to the sites route", async () => {
    mockFetchOnce(200, { token: "jwt-token", expiresAt: "2026-08-01T00:00:00Z" });

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/login", name: "login", component: LoginView },
        { path: "/", name: "sites", component: { template: "<div>Sites</div>" } }
      ]
    });
    router.push("/login");
    await router.isReady();

    const wrapper = mountWithPlugins(LoginView, { global: { plugins: [router] } });

    await wrapper.vm.submit();
    await router.isReady();

    expect(router.currentRoute.value.name).toBe("sites");
  });
});
