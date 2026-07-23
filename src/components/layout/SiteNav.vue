<script setup lang="ts">
defineProps<{ siteId: string; active: "hopups" | "phone-pool" | "analytics" }>();
</script>

<template>
  <nav class="site-nav">
    <RouterLink :to="{ name: 'sites' }" class="back-link">&larr; Sites</RouterLink>
    <RouterLink :to="{ name: 'hopups', params: { siteId } }" class="tab" :class="{ active: active === 'hopups' }">
      Hopups
    </RouterLink>
    <RouterLink
      :to="{ name: 'phone-pool', params: { siteId } }"
      class="tab"
      :class="{ active: active === 'phone-pool' }"
    >
      Phone pool
    </RouterLink>
    <RouterLink
      :to="{ name: 'analytics', params: { siteId } }"
      class="tab"
      :class="{ active: active === 'analytics' }"
    >
      Analytics
    </RouterLink>
  </nav>
</template>

<style scoped>
.site-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid var(--hopups-gray);
  margin-bottom: 1.5rem;
}

.back-link {
  color: #757575;
  text-decoration: none;
  margin-right: 1rem;
  font-size: 0.9em;
}

.tab {
  padding: 0.75rem 0.1rem;
  color: var(--hopups-text);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 3px solid transparent;
}

.tab.active {
  color: var(--hopups-pink);
  border-bottom-color: var(--hopups-pink);
}
</style>
