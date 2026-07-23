<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();
const router = useRouter();

async function logout(): Promise<void> {
  auth.logout();
  await router.push({ name: "login" });
}
</script>

<template>
  <div class="app-shell">
    <header v-if="auth.isAuthenticated" class="main-toolbar">
      <RouterLink :to="{ name: 'sites' }" class="brand" title="HopUps">
        <span class="pi pi-bolt" aria-hidden="true"></span>
        <h1>HopUps</h1>
      </RouterLink>
      <div class="toolbar-actions">
        <RouterLink :to="{ name: 'demo-site' }" class="demo-link">Demo site</RouterLink>
        <button class="logout-button" @click="logout">Log out</button>
      </div>
    </header>
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-toolbar {
  position: sticky;
  top: 0;
  z-index: 65;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: linear-gradient(90deg, var(--hopups-purple) 0%, var(--hopups-teal) 100%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--hopups-text-on-dark);
  text-decoration: none;
}

.brand h1 {
  color: var(--hopups-text-on-dark);
  letter-spacing: 0.02em;
}

.brand .pi {
  font-size: 1.25rem;
  color: var(--hopups-pink);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.demo-link {
  color: var(--hopups-text-on-dark);
  text-decoration: none;
  font-size: 0.9em;
}

.demo-link:hover {
  text-decoration: underline;
}

.logout-button {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: var(--hopups-text-on-dark);
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  transition: background-color 0.15s ease-in-out;
}

.logout-button:hover {
  background: var(--hopups-pink);
}

.app-content {
  flex: 1;
  padding: 1.5rem 2rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}
</style>
