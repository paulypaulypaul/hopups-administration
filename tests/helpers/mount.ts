import { mount, type MountingOptions } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PrimeVue from "primevue/config";
import type { Component } from "vue";
import { PRIME_COMPONENTS } from "../../src/plugins/primevueComponents";

export function mountWithPlugins<T extends Component>(component: T, options: MountingOptions<any> = {}) {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [pinia, PrimeVue, ...(options.global?.plugins ?? [])],
      components: { ...PRIME_COMPONENTS, ...(options.global?.components ?? {}) }
    }
  });
}
