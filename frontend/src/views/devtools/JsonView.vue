<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { JSON_EXAMPLE } from "@/utils/devtools/examples.js";
import {
  formatJson,
  minifyJson,
  sortJsonKeys,
  validateJson,
  type JsonIndent,
} from "@/utils/devtools/json.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const indent = ref<JsonIndent>(2);
const indentOptions = [
  { label: "2", value: 2 },
  { label: "4", value: 4 },
  { label: "Tab", value: "tab" },
];
const valid = ref(false);

async function execute(action: () => ReturnType<typeof formatJson>): Promise<void> {
  valid.value = false;
  await run(action);
}

const format = () => execute(() => formatJson(input.value, indent.value));
const minify = () => execute(() => minifyJson(input.value));
const sortKeys = () => execute(() => sortJsonKeys(input.value, indent.value));

async function validate(): Promise<void> {
  valid.value = false;
  const ok = await run(() => {
    const result = validateJson(input.value);
    return result.ok ? { ok: true, value: "" } : result;
  });
  valid.value = ok;
}

async function loadExample(): Promise<void> {
  input.value = JSON_EXAMPLE;
  await format();
}

function onClear(): void {
  clear();
  valid.value = false;
}
</script>

<template>
  <ToolLayout tool-id="json" icon="pi-code" :description="t('devtools.json.description')" wide>
    <ToolToolbar>
      <div class="toolbar__field">
        <span>{{ t("devtools.json.indent") }}</span>
        <SelectButton
          v-model="indent"
          :options="indentOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
        />
      </div>
      <Button :label="t('devtools.json.format')" icon="pi pi-align-left" @click="format" />
      <Button
        :label="t('devtools.json.minify')"
        icon="pi pi-compress"
        severity="secondary"
        @click="minify"
      />
      <Button
        :label="t('devtools.json.validate')"
        icon="pi pi-check"
        severity="secondary"
        @click="validate"
      />
      <Button
        :label="t('devtools.json.sortKeys')"
        icon="pi pi-sort-alpha-down"
        severity="secondary"
        @click="sortKeys"
      />
      <Button
        :label="t('devtools.common.example')"
        icon="pi pi-lightbulb"
        severity="help"
        outlined
        @click="loadExample"
      />
      <Button
        :label="t('devtools.common.clear')"
        icon="pi pi-trash"
        text
        severity="danger"
        @click="onClear"
      />
    </ToolToolbar>

    <p v-if="valid" class="status-ok" role="status">
      <i class="pi pi-check-circle" aria-hidden="true" /> {{ t("devtools.json.valid") }}
    </p>

    <TextIOPanel
      v-model="input"
      :output="output"
      :error="error"
      placeholder='{"key": "value"}'
      @submit="format"
    />
    <p class="shortcut-hint">{{ t("devtools.json.shortcut") }}</p>
  </ToolLayout>
</template>

<style scoped>
.status-ok {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  margin: 0 0 var(--dc-space-sm);
  color: var(--dc-accent);
  font-size: 0.8125rem;
}

.shortcut-hint {
  margin: var(--dc-space-xs) 0 0;
  color: var(--dc-text-dim);
  font-size: 0.75rem;
}
</style>
