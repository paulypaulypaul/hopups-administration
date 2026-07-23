<script setup lang="ts">
import { computed, ref } from "vue";
import { createHopup, updateHopup, type Condition, type Hopup } from "../api/hopups";
import { addAction, deleteAction, updateAction, type Action } from "../api/actions";
import ConditionBuilder from "./ConditionBuilder.vue";
import ActionEditor, { type ActionFormValue } from "./ActionEditor.vue";

const props = defineProps<{ siteId: string; existingHopup?: Hopup }>();
const emit = defineEmits<{
  (e: "created", hopup: Hopup): void;
  (e: "updated", hopup: Hopup): void;
}>();

const isEditMode = computed(() => props.existingHopup !== undefined);

const conditions = ref<Condition[]>(props.existingHopup ? [...props.existingHopup.conditions] : []);
const repeatAllowance = ref<number>(props.existingHopup?.repeatAllowance ?? 1);
const active = ref<boolean>(props.existingHopup?.active ?? true);

// Create mode: actions are held locally until the hopup itself is created.
const draftActions = ref<ActionFormValue[]>([]);
const newDraftAction = ref<ActionFormValue>({ type: "banner", payload: { message: "" } });

const canSaveCreate = computed(() => draftActions.value.length >= 1);

function addDraftAction(): void {
  draftActions.value = [...draftActions.value, { type: newDraftAction.value.type, payload: { ...newDraftAction.value.payload } }];
}

function removeDraftAction(index: number): void {
  draftActions.value = draftActions.value.filter((_, i) => i !== index);
}

async function submitCreate(): Promise<void> {
  if (!canSaveCreate.value) {
    return;
  }
  const hopup = await createHopup(props.siteId, {
    active: active.value,
    conditions: conditions.value,
    repeatAllowance: repeatAllowance.value,
    actions: draftActions.value.map((a) => ({ type: a.type, payload: a.payload }))
  });
  emit("created", hopup);
}

// Edit mode: actions are already persisted; each is edited/removed independently.
const existingActions = ref<Action[]>(props.existingHopup ? [...props.existingHopup.actions] : []);
const editableActions = ref<ActionFormValue[]>(
  existingActions.value.map((a) => ({ type: a.type, payload: a.payload as Record<string, unknown> }))
);
const newActionForEdit = ref<ActionFormValue>({ type: "banner", payload: { message: "" } });

const canDeleteAction = computed(() => existingActions.value.length > 1);

async function submitConditions(): Promise<void> {
  if (!props.existingHopup) {
    return;
  }
  const hopup = await updateHopup(props.existingHopup.id, {
    active: active.value,
    conditions: conditions.value,
    repeatAllowance: repeatAllowance.value
  });
  emit("updated", hopup);
}

async function addExistingAction(): Promise<void> {
  if (!props.existingHopup) {
    return;
  }
  const action = await addAction(props.existingHopup.id, newActionForEdit.value.type, newActionForEdit.value.payload);
  existingActions.value = [...existingActions.value, action];
  editableActions.value = [...editableActions.value, { type: action.type, payload: action.payload as Record<string, unknown> }];
}

async function saveExistingAction(index: number): Promise<void> {
  const action = existingActions.value[index];
  const value = editableActions.value[index];
  const updated = await updateAction(action.id, { type: value.type, payload: value.payload });
  existingActions.value = existingActions.value.map((a, i) => (i === index ? updated : a));
}

async function removeExistingAction(index: number): Promise<void> {
  if (!canDeleteAction.value) {
    return;
  }
  const action = existingActions.value[index];
  await deleteAction(action.id);
  existingActions.value = existingActions.value.filter((_, i) => i !== index);
  editableActions.value = editableActions.value.filter((_, i) => i !== index);
}

defineExpose({ canSaveCreate, canDeleteAction, submitCreate, submitConditions, addExistingAction, saveExistingAction, removeExistingAction });
</script>

<template>
  <div class="hopup-editor">
    <div class="field">
      <label>
        <input type="checkbox" v-model="active" data-testid="hopup-active" />
        Active
      </label>
    </div>
    <div class="field">
      <label for="repeat-allowance">Repeat allowance</label>
      <InputNumber id="repeat-allowance" v-model="repeatAllowance" :min="1" data-testid="hopup-repeat-allowance" />
    </div>

    <h3>Conditions</h3>
    <ConditionBuilder v-model="conditions" />

    <h3>Actions</h3>

    <template v-if="!isEditMode">
      <ul>
        <li v-for="(a, i) in draftActions" :key="i" data-testid="draft-action-row">
          {{ a.type }}
          <Button label="Remove" text severity="danger" @click="removeDraftAction(i)" />
        </li>
      </ul>
      <ActionEditor v-model="newDraftAction" />
      <Button label="Add action" text data-testid="add-draft-action" @click="addDraftAction" />
      <p v-if="draftActions.length === 0" class="hint">At least one action is required.</p>
      <Button label="Create hopup" data-testid="submit-create" :disabled="!canSaveCreate" @click="submitCreate" />
    </template>

    <template v-else>
      <ul>
        <li v-for="(a, i) in existingActions" :key="a.id" data-testid="existing-action-row">
          <ActionEditor v-model="editableActions[i]" />
          <Button label="Save" data-testid="save-existing-action" @click="saveExistingAction(i)" />
          <Button
            label="Delete"
            text
            severity="danger"
            data-testid="delete-existing-action"
            :disabled="!canDeleteAction"
            @click="removeExistingAction(i)"
          />
        </li>
      </ul>
      <ActionEditor v-model="newActionForEdit" />
      <Button label="Add action" text data-testid="add-existing-action" @click="addExistingAction" />
      <Button label="Save conditions" data-testid="submit-conditions" @click="submitConditions" />
    </template>
  </div>
</template>
