<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { listSites, type Site } from "../api/sites";

const DEMO_SITE_NAME = "Coats N Stuff";
const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function pickDemoSite(sites: Site[]): Site | null {
  return sites.find((site) => site.name === DEMO_SITE_NAME) ?? sites[0] ?? null;
}

const sites = ref<Site[]>([]);
const selectedSiteId = ref<string | null>(null);
const loading = ref(true);

async function load(): Promise<void> {
  loading.value = true;
  sites.value = await listSites();
  selectedSiteId.value = pickDemoSite(sites.value)?.id ?? null;
  loading.value = false;
}

onMounted(load);

const selectedSite = computed(() => sites.value.find((site) => site.id === selectedSiteId.value) ?? null);

const iframeSrc = computed(() => {
  if (!selectedSiteId.value) {
    return "";
  }
  const params = new URLSearchParams({ siteId: selectedSiteId.value, apiBase });
  return `/demo-site.html?${params.toString()}`;
});

defineExpose({ load, sites, selectedSiteId, iframeSrc, pickDemoSite });
</script>

<template>
  <div class="demo-site-view">
    <h1>Demo site</h1>
    <p class="hint">
      This simulates a real customer website with the Hopups widget embedded, running against
      <strong v-if="selectedSite">{{ selectedSite.name }}</strong
      >.
    </p>

    <select
      v-if="sites.length > 1"
      v-model="selectedSiteId"
      data-testid="demo-site-selector"
    >
      <option v-for="site in sites" :key="site.id" :value="site.id">{{ site.name }}</option>
    </select>

    <p v-if="!loading && sites.length === 0" class="empty-state" data-testid="demo-site-empty-state">
      No sites yet — create one first.
    </p>

    <iframe
      v-else-if="iframeSrc"
      :src="iframeSrc"
      class="demo-frame"
      title="Demo site preview"
      data-testid="demo-site-frame"
    />
  </div>
</template>

<style scoped>
.demo-frame {
  width: 100%;
  height: 600px;
  border: 1px solid var(--hopups-gray);
  border-radius: 4px;
  margin-top: 1rem;
}
</style>
