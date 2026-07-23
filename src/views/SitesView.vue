<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createSite, deleteSite, listSites, renameSite, type Site } from "../api/sites";

const sites = ref<Site[]>([]);
const loading = ref(true);
const newSiteName = ref("");
const showCreateDialog = ref(false);
const siteToDelete = ref<Site | null>(null);
const editingSite = ref<Site | null>(null);
const editingName = ref("");

async function load(): Promise<void> {
  loading.value = true;
  sites.value = await listSites();
  loading.value = false;
}

onMounted(load);

async function submitCreate(): Promise<void> {
  if (!newSiteName.value.trim()) {
    return;
  }
  const site = await createSite(newSiteName.value.trim());
  sites.value = [...sites.value, site];
  newSiteName.value = "";
  showCreateDialog.value = false;
}

function startEdit(site: Site): void {
  editingSite.value = site;
  editingName.value = site.name;
}

async function submitRename(): Promise<void> {
  if (!editingSite.value) {
    return;
  }
  const updated = await renameSite(editingSite.value.id, editingName.value.trim());
  sites.value = sites.value.map((s) => (s.id === updated.id ? updated : s));
  editingSite.value = null;
}

function confirmDelete(site: Site): void {
  siteToDelete.value = site;
}

async function submitDelete(): Promise<void> {
  if (!siteToDelete.value) {
    return;
  }
  await deleteSite(siteToDelete.value.id);
  sites.value = sites.value.filter((s) => s.id !== siteToDelete.value?.id);
  siteToDelete.value = null;
}

defineExpose({ load, submitCreate, submitRename, submitDelete, startEdit, confirmDelete, newSiteName, sites });
</script>

<template>
  <div class="sites-view">
    <div class="toolbar">
      <h1>Sites</h1>
      <Button label="New site" data-testid="new-site" @click="showCreateDialog = true" />
    </div>

    <p v-if="!loading && sites.length === 0" class="empty-state" data-testid="empty-state">No sites yet.</p>

    <ul v-else class="sites-list">
      <li v-for="site in sites" :key="site.id" data-testid="site-row">
        <template v-if="editingSite?.id === site.id">
          <InputText v-model="editingName" data-testid="edit-site-name" />
          <Button label="Save" data-testid="save-rename" @click="submitRename" />
          <Button label="Cancel" text @click="editingSite = null" />
        </template>
        <template v-else>
          <span class="site-name" data-testid="site-name">{{ site.name }}</span>
          <RouterLink :to="{ name: 'hopups', params: { siteId: site.id } }">Hopups</RouterLink>
          <RouterLink :to="{ name: 'phone-pool', params: { siteId: site.id } }">Phone pool</RouterLink>
          <RouterLink :to="{ name: 'analytics', params: { siteId: site.id } }">Analytics</RouterLink>
          <Button label="Rename" text @click="startEdit(site)" />
          <Button label="Delete" text severity="danger" data-testid="delete-site" @click="confirmDelete(site)" />
        </template>
      </li>
    </ul>

    <Dialog append-to="self" v-model:visible="showCreateDialog" header="New site" modal>
      <div class="field">
        <label for="new-site-name">Name</label>
        <InputText id="new-site-name" v-model="newSiteName" data-testid="new-site-name" @keyup.enter="submitCreate" />
      </div>
      <Button label="Create" data-testid="submit-create-site" @click="submitCreate" />
    </Dialog>

    <Dialog append-to="self" :visible="siteToDelete !== null" header="Delete site" modal @update:visible="siteToDelete = null">
      <p data-testid="delete-confirmation-message">
        Deleting <strong>{{ siteToDelete?.name }}</strong> will also delete its hopups, actions, and
        phone pool. This cannot be undone.
      </p>
      <Button label="Cancel" text @click="siteToDelete = null" />
      <Button label="Delete" severity="danger" data-testid="confirm-delete-site" @click="submitDelete" />
    </Dialog>
  </div>
</template>

<style scoped>
.sites-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sites-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.site-name {
  font-weight: 500;
  flex: 1;
}

.sites-list a {
  color: var(--hopups-purple);
  text-decoration: none;
  font-size: 0.9em;
}

.sites-list a:hover {
  text-decoration: underline;
}
</style>

