import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import "./assets/main.css";

import App from "./App.vue";
import { router } from "./router";
import { useAuthStore } from "./stores/auth";
import { configureApiClient } from "./api/client";
import { PRIME_COMPONENTS } from "./plugins/primevueComponents";
import { HopupsPreset } from "./plugins/theme";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, { theme: { preset: HopupsPreset } });

for (const [name, component] of Object.entries(PRIME_COMPONENTS)) {
  app.component(name, component);
}

const authStore = useAuthStore();
configureApiClient({
  getToken: () => authStore.token,
  onUnauthorized: () => {
    authStore.logout();
    if (router.currentRoute.value.name !== "login") {
      router.push({ name: "login" });
    }
  }
});

app.mount("#app");
