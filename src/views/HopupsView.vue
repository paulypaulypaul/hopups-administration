<script setup lang="ts">
import { onMounted, ref } from "vue";
import { deleteHopup, listHopups, type Hopup } from "../api/hopups";
import HopupEditor from "../components/HopupEditor.vue";

const props = defineProps<{ siteId: string }>();

const hopups = ref<Hopup[]>([]);
const loading = ref(true);
const showCreateDialog = ref(false);
const editingHopup = ref<Hopup | null>(null);
const hopupToDelete = ref<Hopup | null>(null);

async function load(): Promise<void> {
  loading.value = true;
  hopups.value = await listHopups(props.siteId);
  loading.value = false;
}

onMounted(load);

function onCreated(hopup: Hopup): void {
  hopups.value = [...hopups.value, hopup];
  showCreateDialog.value = false;
}

function onUpdated(hopup: Hopup): void {
  hopups.value = hopups.value.map((h) => (h.id === hopup.id ? hopup : h));
  editingHopup.value = hopup;
}

function confirmDelete(hopup: Hopup): void {
  hopupToDelete.value = hopup;
}

async function submitDelete(): Promise<void> {
  if (!hopupToDelete.value) {
    return;
  }
  await deleteHopup(hopupToDelete.value.id);
  hopups.value = hopups.value.filter((h) => h.id !== hopupToDelete.value?.id);
  hopupToDelete.value = null;
}
</script>

<template>
  <div class="hopups-view">
    <div class="toolbar">
      <h1>Hopups</h1>
      <Button label="New hopup" data-testid="new-hopup" @click="showCreateDialog = true" />
    </div>

    <p v-if="!loading && hopups.length === 0" class="empty-state">No hopups yet.</p>

    <ul v-else class="hopups-list">
      <li v-for="hopup in hopups" :key="hopup.id" data-testid="hopup-row">
        <span>{{ hopup.active ? "Active" : "Inactive" }}</span>
        <span>Repeat allowance: {{ hopup.repeatAllowance }}</span>
        <span>{{ hopup.conditions.length }} condition(s)</span>
        <span>{{ hopup.actions.length }} action(s)</span>
        <Button label="Edit" text @click="editingHopup = hopup" />
        <Button label="Delete" text severity="danger" @click="confirmDelete(hopup)" />
      </li>
    </ul>

    <Dialog append-to="self" v-model:visible="showCreateDialog" header="New hopup" modal>
      <HopupEditor :site-id="siteId" @created="onCreated" />
    </Dialog>

    <Dialog append-to="self" :visible="editingHopup !== null" header="Edit hopup" modal @update:visible="editingHopup = null">
      <HopupEditor v-if="editingHopup" :site-id="siteId" :existing-hopup="editingHopup" @updated="onUpdated" />
    </Dialog>

    <Dialog append-to="self" :visible="hopupToDelete !== null" header="Delete hopup" modal @update:visible="hopupToDelete = null">
      <p>Delete this hopup? This cannot be undone.</p>
      <Button label="Cancel" text @click="hopupToDelete = null" />
      <Button label="Delete" severity="danger" @click="submitDelete" />
    </Dialog>
  </div>
</template>
