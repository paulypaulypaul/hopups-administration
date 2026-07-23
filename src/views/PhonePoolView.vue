<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getPhonePool, updatePhonePool } from "../api/phonePool";
import SiteNav from "../components/layout/SiteNav.vue";

const props = defineProps<{ siteId: string }>();

const numbers = ref<string[]>([]);
const defaultNumber = ref<string>("");
const newNumber = ref("");
const loading = ref(true);
const saved = ref(false);

async function load(): Promise<void> {
  loading.value = true;
  const pool = await getPhonePool(props.siteId);
  numbers.value = [...pool.numbers];
  defaultNumber.value = pool.defaultNumber ?? "";
  loading.value = false;
}

onMounted(load);

function addNumber(): void {
  if (!newNumber.value.trim()) {
    return;
  }
  numbers.value = [...numbers.value, newNumber.value.trim()];
  newNumber.value = "";
}

function removeNumber(index: number): void {
  numbers.value = numbers.value.filter((_, i) => i !== index);
}

async function save(): Promise<void> {
  saved.value = false;
  await updatePhonePool(props.siteId, {
    numbers: numbers.value,
    defaultNumber: defaultNumber.value.trim() === "" ? null : defaultNumber.value.trim()
  });
  saved.value = true;
}

defineExpose({ load, addNumber, removeNumber, save });
</script>

<template>
  <div class="phone-pool-view">
    <SiteNav :site-id="siteId" active="phone-pool" />
    <h1>Phone pool</h1>

    <h3>Numbers</h3>
    <ul>
      <li v-for="(number, index) in numbers" :key="index" data-testid="pool-number-row">
        {{ number }}
        <Button label="Remove" text severity="danger" @click="removeNumber(index)" />
      </li>
    </ul>
    <InputText v-model="newNumber" placeholder="+1-555-0100" data-testid="new-number" @keyup.enter="addNumber" />
    <Button label="Add number" text data-testid="add-number" @click="addNumber" />

    <h3>Default number</h3>
    <InputText v-model="defaultNumber" placeholder="(none)" data-testid="default-number" />

    <Button label="Save" data-testid="save-pool" @click="save" />
    <p v-if="saved" data-testid="save-confirmation">Saved.</p>
  </div>
</template>
