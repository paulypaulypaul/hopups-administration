import { createRouter, createMemoryHistory, type Router } from "vue-router";

const Placeholder = { template: "<div />" };

export function createTestRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/login", name: "login", component: Placeholder },
      { path: "/", name: "sites", component: Placeholder },
      { path: "/sites/:siteId/hopups", name: "hopups", component: Placeholder },
      { path: "/sites/:siteId/phone-pool", name: "phone-pool", component: Placeholder },
      { path: "/sites/:siteId/analytics", name: "analytics", component: Placeholder }
    ]
  });
}
