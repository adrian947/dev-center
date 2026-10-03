<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Textarea from "primevue/textarea";

const props = defineProps<{
  modelValue: string;
  output: string;
  error: string | null;
  inputLabel?: string;
  outputLabel?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [];
}>();

const { t, te } = useI18n();
const toast = useToast();

function errorText(error: string): string {
  return te(`devtools.common.errors.${error}`) ? t(`devtools.common.errors.${error}`) : error;
}

async function copyOutput(): Promise<void> {
  await navigator.clipboard.writeText(props.output);
  toast.add({ severity: "success", summary: t("devtools.common.copied"), life: 1500 });
}
</script>

<template>
  <div class="io">
    <div class="io__pane">
      <div class="io__label-row">
        <label class="io__label" :for="`io-in-${$.uid}`">{{
          inputLabel ?? t("devtools.common.input")
        }}</label>
      </div>
      <Textarea
        :id="`io-in-${$.uid}`"
        class="io__area dc-mono"
        :model-value="modelValue"
        :placeholder="placeholder"
        spellcheck="false"
        rows="14"
        @update:model-value="emit('update:modelValue', $event ?? '')"
        @keydown.ctrl.enter.prevent="emit('submit')"
        @keydown.meta.enter.prevent="emit('submit')"
      />
    </div>

    <div class="io__pane">
      <div class="io__label-row">
        <label class="io__label" :for="`io-out-${$.uid}`">{{
          outputLabel ?? t("devtools.common.output")
        }}</label>
        <Button
          :label="t('devtools.common.copy')"
          icon="pi pi-copy"
          text
          size="small"
          :disabled="!output"
          @click="copyOutput"
        />
      </div>
      <Textarea
        :id="`io-out-${$.uid}`"
        class="io__area dc-mono"
        :model-value="output"
        readonly
        rows="14"
      />
    </div>

    <p v-if="error" class="io__error" role="alert">
      <i class="pi pi-exclamation-triangle" aria-hidden="true" />
      {{ errorText(error) }}
    </p>
  </div>
</template>

<style scoped>
.io {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dc-space-md);
}

.io__pane {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  min-width: 0;
}

.io__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
}

.io__label {
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.io .io__area {
  width: 100%;
  font-family: var(--dc-font-mono);
  min-height: 260px;
  font-size: 0.8125rem;
  resize: vertical;
}

.io__error {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: var(--dc-space-xs);
  margin: 0;
  padding: var(--dc-space-xs) var(--dc-space-sm);
  border: 1px solid var(--dc-danger);
  border-radius: var(--dc-radius);
  background: var(--dc-danger-glow);
  color: var(--dc-text);
  font-size: 0.8125rem;
  word-break: break-word;
}

@media (max-width: 900px) {
  .io {
    grid-template-columns: 1fr;
  }
}
</style>
