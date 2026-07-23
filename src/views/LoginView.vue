<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ApiError } from "../api/client";

const username = ref("");
const password = ref("");
const error = ref<string | null>(null);
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function submit(): Promise<void> {
  error.value = null;
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    await router.push({ name: "sites" });
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : "Login failed";
  } finally {
    loading.value = false;
  }
}

defineExpose({ submit });
</script>

<template>
  <div class="login-view">
    <h1>Hopups Admin</h1>
    <form data-testid="login-form" @submit.prevent="submit">
      <div class="field">
        <label for="username">Username</label>
        <InputText id="username" v-model="username" data-testid="username" />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <Password id="password" v-model="password" :feedback="false" toggleMask input-id="password" data-testid="password" />
      </div>
      <p v-if="error" class="error" role="alert" data-testid="login-error">{{ error }}</p>
      <Button type="submit" label="Log in" :loading="loading" data-testid="submit" />
    </form>
  </div>
</template>
