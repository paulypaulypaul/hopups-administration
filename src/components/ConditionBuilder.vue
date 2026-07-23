<script setup lang="ts">
import type { Condition, Operator } from "../api/hopups";

const props = defineProps<{ modelValue: Condition[] }>();
const emit = defineEmits<{ (e: "update:modelValue", value: Condition[]): void }>();

const OPERATORS: Operator[] = ["eq", "neq", "gt", "gte", "lt", "lte", "in", "matches"];

function parseValue(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

function updateRow(index: number, patch: Partial<Condition>): void {
  const next = props.modelValue.map((condition, i) => (i === index ? { ...condition, ...patch } : condition));
  emit("update:modelValue", next);
}

function updateValue(index: number, raw: string): void {
  updateRow(index, { value: parseValue(raw) });
}

function addRow(): void {
  emit("update:modelValue", [...props.modelValue, { signal: "", operator: "eq", value: "" }]);
}

function removeRow(index: number): void {
  emit(
    "update:modelValue",
    props.modelValue.filter((_, i) => i !== index)
  );
}

defineExpose({ parseValue, stringifyValue, addRow, removeRow, updateRow, updateValue });
</script>

<template>
  <div class="condition-builder">
    <div v-for="(condition, index) in modelValue" :key="index" class="condition-row" data-testid="condition-row">
      <InputText
        :model-value="condition.signal"
        placeholder="signal (e.g. page.path)"
        data-testid="condition-signal"
        @update:model-value="(v) => updateRow(index, { signal: String(v) })"
      />
      <Select
        :model-value="condition.operator"
        :options="OPERATORS"
        data-testid="condition-operator"
        @update:model-value="(v) => updateRow(index, { operator: v as Operator })"
      />
      <InputText
        :model-value="stringifyValue(condition.value)"
        placeholder="value"
        data-testid="condition-value"
        @update:model-value="(v) => updateValue(index, String(v))"
      />
      <Button label="Remove" text severity="danger" data-testid="condition-remove" @click="removeRow(index)" />
    </div>
    <Button label="Add condition" text data-testid="condition-add" @click="addRow" />
  </div>
</template>
