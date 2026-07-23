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
    <header v-if="auth.isAuthenticated" class="app-header">
      <RouterLink :to="{ name: 'sites' }">Hopups Admin</RouterLink>
      <button @click="logout">Log out</button>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
