import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../stores/auth";
import LoginView from "../views/LoginView.vue";
import SitesView from "../views/SitesView.vue";
import HopupsView from "../views/HopupsView.vue";
import PhonePoolView from "../views/PhonePoolView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";

export function resolveGuardRedirect(
  toName: RouteLocationNormalized["name"],
  isAuthenticated: boolean
): "login" | "sites" | null {
  if (toName !== "login" && !isAuthenticated) {
    return "login";
  }
  if (toName === "login" && isAuthenticated) {
    return "sites";
  }
  return null;
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: LoginView },
    { path: "/", name: "sites", component: SitesView },
    { path: "/sites/:siteId/hopups", name: "hopups", component: HopupsView, props: true },
    { path: "/sites/:siteId/phone-pool", name: "phone-pool", component: PhonePoolView, props: true },
    { path: "/sites/:siteId/analytics", name: "analytics", component: AnalyticsView, props: true }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const redirect = resolveGuardRedirect(to.name, auth.isAuthenticated);
  return redirect ? { name: redirect } : true;
});
