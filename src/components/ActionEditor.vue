<script setup lang="ts">
import type { ActionType } from "../api/actions";

export interface ActionFormValue {
  type: ActionType;
  payload: Record<string, unknown>;
}

const props = defineProps<{ modelValue: ActionFormValue }>();
const emit = defineEmits<{ (e: "update:modelValue", value: ActionFormValue): void }>();

const ACTION_TYPES: ActionType[] = ["modal", "banner", "phoneNumberSwap", "redirect", "customHtml", "sidebar"];

const EMPTY_PAYLOADS: Record<ActionType, Record<string, unknown>> = {
  modal: { title: "", body: "", ctaLabel: "", ctaUrl: "" },
  banner: { message: "", ctaLabel: "", ctaUrl: "" },
  phoneNumberSwap: { selector: "" },
  redirect: { url: "", delayMs: undefined },
  customHtml: { html: "" },
  sidebar: { position: "right", title: "", message: "", ctaLabel: "", ctaUrl: "" }
};

function setType(type: ActionType): void {
  emit("update:modelValue", { type, payload: { ...EMPTY_PAYLOADS[type] } });
}

function setField(field: string, value: unknown): void {
  emit("update:modelValue", { ...props.modelValue, payload: { ...props.modelValue.payload, [field]: value } });
}

defineExpose({ setType, setField, EMPTY_PAYLOADS });
</script>

<template>
  <div class="action-editor">
    <Select
      :model-value="modelValue.type"
      :options="ACTION_TYPES"
      data-testid="action-type"
      @update:model-value="(v) => setType(v as ActionType)"
    />

    <template v-if="modelValue.type === 'modal'">
      <InputText
        placeholder="Title"
        data-testid="field-title"
        :model-value="modelValue.payload.title as string"
        @update:model-value="(v) => setField('title', v)"
      />
      <Textarea
        placeholder="Body"
        data-testid="field-body"
        :model-value="modelValue.payload.body as string"
        @update:model-value="(v) => setField('body', v)"
      />
      <InputText
        placeholder="CTA label"
        data-testid="field-ctaLabel"
        :model-value="modelValue.payload.ctaLabel as string"
        @update:model-value="(v) => setField('ctaLabel', v)"
      />
      <InputText
        placeholder="CTA URL"
        data-testid="field-ctaUrl"
        :model-value="modelValue.payload.ctaUrl as string"
        @update:model-value="(v) => setField('ctaUrl', v)"
      />
    </template>

    <template v-else-if="modelValue.type === 'banner'">
      <InputText
        placeholder="Message"
        data-testid="field-message"
        :model-value="modelValue.payload.message as string"
        @update:model-value="(v) => setField('message', v)"
      />
      <InputText
        placeholder="CTA label"
        data-testid="field-ctaLabel"
        :model-value="modelValue.payload.ctaLabel as string"
        @update:model-value="(v) => setField('ctaLabel', v)"
      />
      <InputText
        placeholder="CTA URL"
        data-testid="field-ctaUrl"
        :model-value="modelValue.payload.ctaUrl as string"
        @update:model-value="(v) => setField('ctaUrl', v)"
      />
    </template>

    <template v-else-if="modelValue.type === 'phoneNumberSwap'">
      <InputText
        placeholder="CSS selector"
        data-testid="field-selector"
        :model-value="modelValue.payload.selector as string"
        @update:model-value="(v) => setField('selector', v)"
      />
    </template>

    <template v-else-if="modelValue.type === 'redirect'">
      <InputText
        placeholder="URL"
        data-testid="field-url"
        :model-value="modelValue.payload.url as string"
        @update:model-value="(v) => setField('url', v)"
      />
      <InputNumber
        placeholder="Delay (ms)"
        data-testid="field-delayMs"
        :model-value="modelValue.payload.delayMs as number"
        @update:model-value="(v) => setField('delayMs', v)"
      />
    </template>

    <template v-else-if="modelValue.type === 'customHtml'">
      <Textarea
        placeholder="HTML"
        data-testid="field-html"
        :model-value="modelValue.payload.html as string"
        @update:model-value="(v) => setField('html', v)"
      />
    </template>

    <template v-else-if="modelValue.type === 'sidebar'">
      <Select
        :options="['left', 'right']"
        data-testid="field-position"
        :model-value="modelValue.payload.position as string"
        @update:model-value="(v) => setField('position', v)"
      />
      <InputText
        placeholder="Title (optional)"
        data-testid="field-title"
        :model-value="modelValue.payload.title as string"
        @update:model-value="(v) => setField('title', v)"
      />
      <InputText
        placeholder="Message"
        data-testid="field-message"
        :model-value="modelValue.payload.message as string"
        @update:model-value="(v) => setField('message', v)"
      />
      <InputText
        placeholder="CTA label"
        data-testid="field-ctaLabel"
        :model-value="modelValue.payload.ctaLabel as string"
        @update:model-value="(v) => setField('ctaLabel', v)"
      />
      <InputText
        placeholder="CTA URL"
        data-testid="field-ctaUrl"
        :model-value="modelValue.payload.ctaUrl as string"
        @update:model-value="(v) => setField('ctaUrl', v)"
      />
    </template>
  </div>
</template>
