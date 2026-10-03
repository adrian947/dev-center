<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { URL_EXAMPLE } from "@/utils/devtools/examples.js";
import {
  decodeUrlComponent,
  decodeUrlFull,
  encodeUrlComponent,
  encodeUrlFull,
  parseQueryParams,
} from "@/utils/devtools/urlEncoder.js";

const { t } = useI18n();
const { input, output, error, tooLarge, run, clear } = useToolIO();

const params = computed(() => (tooLarge.value ? [] : parseQueryParams(input.value)));

// Aviso cuando la operación no cambia nada (p. ej. "URL completa" sobre una URL ya bien formada).
const unchanged = ref(false);

async function execute(action: Parameters<typeof run>[0]): Promise<void> {
  unchanged.value = false;
  const ok = await run(action);
  unchanged.value = ok && input.value !== "" && output.value === input.value;
}

const encodeComponent = () => execute(() => ({ ok: true, value: encodeUrlComponent(input.value) }));
const decodeComponent = () => execute(() => decodeUrlComponent(input.value));
const encodeFull = () => execute(() => ({ ok: true, value: encodeUrlFull(input.value) }));
const decodeFull = () => execute(() => decodeUrlFull(input.value));

function onClear(): void {
  clear();
  unchanged.value = false;
}

function loadExample(): void {
  input.value = URL_EXAMPLE;
  void encodeFull();
}
</script>

<template>
  <ToolLayout
    tool-id="urlEncoder"
    icon="pi-link"
    :description="t('devtools.urlEncoder.description')"
    wide
  >
    <ToolToolbar>
      <Button :label="t('devtools.urlEncoder.encodeComponent')" @click="encodeComponent" />
      <Button
        :label="t('devtools.urlEncoder.decodeComponent')"
        severity="secondary"
        @click="decodeComponent"
      />
      <Button
        :label="t('devtools.urlEncoder.encodeFull')"
        severity="secondary"
        @click="encodeFull"
      />
      <Button
        :label="t('devtools.urlEncoder.decodeFull')"
        severity="secondary"
        @click="decodeFull"
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

    <p class="hint">{{ t("devtools.urlEncoder.modeHint") }}</p>
    <p v-if="unchanged" class="hint hint--info" role="status">
      <i class="pi pi-info-circle" aria-hidden="true" /> {{ t("devtools.urlEncoder.unchanged") }}
    </p>

    <TextIOPanel v-model="input" :output="output" :error="error" @submit="encodeComponent" />

    <section v-if="params.length" class="params">
      <h2>{{ t("devtools.urlEncoder.params") }}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">{{ t("devtools.urlEncoder.key") }}</th>
            <th scope="col">{{ t("devtools.urlEncoder.value") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(param, index) in params" :key="`${param.key}-${index}`">
            <td class="dc-mono">{{ param.key }}</td>
            <td class="dc-mono">{{ param.value }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </ToolLayout>
</template>

<style scoped>
.hint {
  margin: 0 0 var(--dc-space-sm);
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
}

.hint--info {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  color: var(--dc-text);
}

.params {
  margin-top: var(--dc-space-md);
  padding: var(--dc-space-md);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  overflow-x: auto;
}

.params h2 {
  margin: 0 0 var(--dc-space-sm);
  font-size: 0.9375rem;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

th,
td {
  padding: var(--dc-space-2xs) var(--dc-space-xs);
  border-bottom: 1px solid var(--dc-hairline);
  text-align: left;
  word-break: break-all;
}

th {
  color: var(--dc-text-muted);
  font-weight: 500;
}
</style>
