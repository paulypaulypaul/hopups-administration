---
name: vue-best-practices
description: >-
  Vue 3 Composition API patterns that agents commonly get wrong: reactivity
  pitfalls, composable structure, Pinia setup stores, watch vs computed,
  storeToRefs, template refs, provide/inject, and accessibility. Use when
  building or reviewing Vue 3 apps.
keywords: vue, vue 3, composition api, composable, pinia, storeToRefs, vue
  router, vue reactivity, ref, reactive, defineProps, defineEmits, defineModel,
  watch, watchEffect, computed, provide, inject, vue typescript, vue component,
  vue best practices, script setup
license: MIT
---

# Vue 3 Best Practices

Patterns that prevent real bugs in Vue 3. Every section leads with WRONG vs RIGHT code.

---

## 1. Component Structure (Script Setup)

```vue
<!-- RIGHT: ProductCard.vue -->
<script setup lang="ts">
interface Props {
  product: Product;
}

const props = defineProps<Props>();
const emit = defineEmits<{ addToCart: [product: Product] }>();
</script>

<template>
  <article class="product-card">
    <h3>{{ product.name }}</h3>
    <span>{{ product.price }}</span>
    <button
      @click="emit('addToCart', product)"
      :aria-label="`Add ${product.name} to cart`"
    >
      Add to cart
    </button>
  </article>
</template>
```

**Rules:**
- Always use `<script setup lang="ts">` (never Options API, never omit `lang="ts"`)
- Type props: `defineProps<Props>()` with a TS interface (not runtime `defineProps({ prop: String })`)
- Type emits: `defineEmits<{ eventName: [payloadType] }>()` with object-and-tuple syntax
- One component per `.vue` file
- Every interactive element (buttons, links) MUST have `:aria-label` with descriptive text
- Error display regions MUST have `role="alert"` for screen readers

---

## 2. Composables: The Complete Pattern

Composables are the primary code-reuse mechanism. Getting the pattern wrong causes subtle bugs.

```typescript
// RIGHT: composables/useOrders.ts
import { ref, onMounted } from 'vue';

export function useOrders() {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOrders() {
    loading.value = true;
    error.value = null;           // Clear stale error BEFORE try
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      orders.value = data.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;      // Always in finally, not in try
    }
  }

  onMounted(fetchOrders);         // Auto-fetch on mount, NOT inline call

  return { orders, loading, error, reload: fetchOrders };
}
```

```vue
<!-- RIGHT: Usage in component -->
<script setup lang="ts">
const { orders, loading, error, reload } = useOrders();
</script>

<template>
  <p v-if="loading">Loading orders...</p>
  <div v-else-if="error" role="alert">
    {{ error }}
    <button @click="reload" :aria-label="'Retry loading orders'">Retry</button>
  </div>
  <OrderList v-else :orders="orders" />
</template>
```

**Critical composable rules:**
- Name: `useThing` convention, file in `composables/` directory
- Return refs (not raw values) so template reactivity works
- Always return a `reload`/`retry` function for consumers
- Use `onMounted(fn)` to trigger initial fetch (not a bare call at setup time)
- Clear error before each fetch attempt (`error.value = null` before try)
- Set loading false in `finally` block, not inside try/catch
- Template: always handle all 3 states with `v-if` / `v-else-if` / `v-else` chain

---

## 3. Reactivity Gotchas: ref vs reactive

### Destructuring reactive() loses reactivity

```typescript
// WRONG: Destructuring breaks reactivity
const state = reactive({ count: 0, name: 'Vue' });
const { count, name } = state;  // count and name are now plain values!

// RIGHT: Use ref() for values you'll destructure
const count = ref(0);
const name = ref('Vue');

// RIGHT: Or use toRefs() if you must destructure reactive
const { count, name } = toRefs(state);
```

### Never reassign a reactive object

```typescript
// WRONG: Breaks all existing references
let form = reactive({ name: '', email: '' });
form = reactive({ name: 'John', email: 'john@example.com' }); // Broken!

// RIGHT: Mutate properties or use Object.assign
Object.assign(form, { name: 'John', email: 'john@example.com' });
```

### Use ref() for primitives, reactive() only when you need a plain object

```typescript
// RIGHT
const count = ref(0);           // Primitive -> ref
const loading = ref(false);     // Primitive -> ref
const error = ref<string | null>(null);  // Primitive/null -> ref
const items = ref<Item[]>([]);  // Array -> ref (preferred)
```

---

## 4. computed vs watch vs watchEffect

This is a common source of bugs: using the wrong one.

```typescript
// computed: For DERIVED VALUES (pure, no side effects)
const fullName = computed(() => `${first.value} ${last.value}`);
const isAdmin = computed(() => user.value?.role === 'admin');

// watch: For SIDE EFFECTS triggered by specific state changes
// USE THIS for: redirects, notifications, API calls, localStorage writes
watch(isAuthenticated, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    router.push('/login');
    showToast('Session expired');
  }
});

// watch with getter for nested property
watch(() => order.value?.status, (newStatus) => {
  if (newStatus === 'ready') showNotification('Order ready!');
});

// watchEffect: For side effects that depend on MULTIPLE reactive sources
// (auto-tracks dependencies, runs immediately)
watchEffect(() => {
  document.title = `${count.value} items in cart`;
});
```

**Key rule:** Side effects (redirect, toast, localStorage, API call) triggered by state changes belong in `watch()`, NOT embedded inside action functions. This ensures they fire consistently regardless of how state changes.

---

## 5. Pinia Setup Stores

### Always use Setup Store syntax (not Options Store)

```typescript
// WRONG: Options Store syntax
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  getters: { isAdmin: (state) => state.user?.role === 'admin' },
  actions: { login(data) { this.user = data; } }
});

// RIGHT: Setup Store syntax
import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Derived values: use computed()
  const userDisplayLabel = computed(() =>
    user.value ? `${user.value.name} (${user.value.role})` : 'Guest'
  );

  // Actions: plain functions
  function login(userData: User) {
    user.value = userData;
    isAuthenticated.value = true;
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
  }

  // Side effects: use watch(), NOT inside action functions
  watch(isAuthenticated, (newVal, oldVal) => {
    if (oldVal && !newVal) {
      router.push('/login');
      showToast('You have been logged out');
    }
  });

  return { user, isAuthenticated, userDisplayLabel, login, logout };
});
```

**Rules:**
- Place store files in `stores/` directory (e.g., `stores/auth.ts`)
- Use `defineStore('name', () => { ... })` setup function syntax
- Use `computed()` for derived values inside the store
- Use `watch()` for reactive side effects (redirects, notifications, persistence)
- Return ALL state, computed, and actions from the setup function
- Use Pinia for cross-component state; use local `ref()` for component-only state (form fields, toggles)

### storeToRefs: Preserve reactivity when destructuring stores

```typescript
// WRONG: Direct destructure loses reactivity on state/getters
const { user, isAuthenticated, login } = useAuthStore();

// RIGHT: Use storeToRefs for state/getters, direct destructure for actions
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user, isAuthenticated, userDisplayLabel } = storeToRefs(authStore);
const { login, logout } = authStore;  // Actions don't need storeToRefs
```

---

## 6. Template Refs with Composition API

```typescript
// RIGHT: Template ref pattern
import { ref, onMounted } from 'vue';

const inputEl = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputEl.value?.focus();
});
```
```vue
<template>
  <input ref="inputEl" />
</template>
```

The `ref()` variable name MUST match the template `ref="..."` attribute value.

---

## 7. v-model on Custom Components

```vue
<!-- Vue 3.4+ with defineModel (PREFERRED) -->
<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>

<!-- Parent usage -->
<MyInput v-model="searchQuery" />
```

```vue
<!-- Pre-3.4 pattern (still valid) -->
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input :value="modelValue" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
</template>
```

---

## 8. Accessibility Requirements

Every Vue component MUST follow these accessibility rules:

- **Buttons:** Always include `:aria-label` with descriptive text, especially for icon buttons or buttons with generic text. Use dynamic labels: `:aria-label="`Add ${item.name} to cart`"`
- **Error regions:** Always add `role="alert"` to error display containers so screen readers announce errors
- **Retry buttons in error states** must also have descriptive `:aria-label` attributes (e.g., `:aria-label="'Retry loading products'"`)
- **Form inputs:** Associate labels with `<label :for="id">` or use `aria-label`
- **Loading states:** Use `aria-busy="true"` on containers being loaded

---

## Checklist

- [ ] `<script setup lang="ts">` on every `.vue` file
- [ ] Props typed with `defineProps<T>()` (TS interface, not runtime syntax)
- [ ] Emits typed with `defineEmits<{ event: [type] }>()` (tuple syntax)
- [ ] Composables in `composables/` dir, named `useThing`, return refs + reload fn
- [ ] Composable uses `onMounted()` for initial data fetch (not bare call)
- [ ] Composable clears error before fetch and sets loading false in `finally`
- [ ] Template handles loading/error/success with `v-if`/`v-else-if`/`v-else` chain
- [ ] `ref()` for primitives; never destructure `reactive()` without `toRefs()`
- [ ] Never reassign reactive objects; use `Object.assign()` to reset
- [ ] Pinia Setup Store syntax (`defineStore('name', () => {...})`)
- [ ] `computed()` for derived values in stores; `watch()` for side effects
- [ ] Side effects (redirect, toast, persist) in `watch()`, not in actions
- [ ] `storeToRefs()` when destructuring store state/getters
- [ ] Store files in `stores/` directory
- [ ] Pinia for shared state, local `ref()` for component-only state
- [ ] `:aria-label` on ALL interactive elements (buttons, links)
- [ ] `role="alert"` on error display containers
- [ ] Template `ref="name"` matches `const name = ref(null)` variable

## References

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Setup Stores](https://pinia.vuejs.org/core-concepts/#Setup-Stores)
- [storeToRefs](https://pinia.vuejs.org/core-concepts/#using-the-store)
- [Vue Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [defineModel](https://vuejs.org/api/sfc-script-setup.html#definemodel)

## Verifiers

- [vue-composition](../../verifiers/vue-composition.json) -- Vue 3 Composition API patterns and best practices
