<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import ToggleButton from "primevue/togglebutton";

const { t } = useI18n();
const toast = useToast();

const quantity = ref(1);
const uppercase = ref(false);
const noDashes = ref(false);
const history = ref<string[]>([]);

function format(uuid: string): string {
  const value = noDashes.value ? uuid.split("-").join("") : uuid;
  return uppercase.value ? value.toUpperCase() : value;
}

function generate(): void {
  const count = Math.min(Math.max(quantity.value || 1, 1), 100);
  const batch = Array.from({ length: count }, () => format(crypto.randomUUID()));
  history.value = [...batch, ...history.value].slice(0, 200);
}

async function copy(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
  toast.add({ severity: "success", summary: t("devtools.uuid.copied"), life: 1500 });
}

async function copyAll(): Promise<void> {
  await navigator.clipboard.writeText(history.value.join("\n"));
  toast.add({ severity: "success", summary: t("devtools.uuid.copied"), life: 1500 });
}

function clear(): void {
  history.value = [];
}

generate();
</script>

<template>
  <div class="uuid-page">
    <header class="page-header">
      <div>
        <RouterLink to="/devtools" class="page-header__back">
          <i class="pi pi-arrow-left" aria-hidden="true" />
          {{ t("devtools.backToToolbox") }}
        </RouterLink>
        <h1><i class="pi pi-sparkles" aria-hidden="true" /> {{ t("devtools.tools.uuid") }}</h1>
        <p class="page-header__subtitle">{{ t("devtools.uuid.description") }}</p>
      </div>
    </header>

    <div class="toolbar">
      <label class="toolbar__field">
        <span>{{ t("devtools.uuid.quantity") }}</span>
        <InputNumber v-model="quantity" :min="1" :max="100" />
      </label>

      <ToggleButton v-model="uppercase" :on-label="t('devtools.uuid.uppercase')" :off-label="t('devtools.uuid.uppercase')" />
      <ToggleButton v-model="noDashes" :on-label="t('devtools.uuid.noDashes')" :off-label="t('devtools.uuid.noDashes')" />

      <Button :label="t('devtools.uuid.generate')" icon="pi pi-refresh" @click="generate" />
    </div>

    <div class="results-panel">
      <div class="results-panel__header">
        <h2>{{ t("devtools.uuid.history") }}</h2>
        <div class="results-panel__actions">
          <Button :label="t('devtools.uuid.copyAll')" icon="pi pi-copy" text size="small" :disabled="!history.length" @click="copyAll" />
          <Button :label="t('devtools.uuid.clear')" icon="pi pi-trash" text size="small" severity="danger" :disabled="!history.length" @click="clear" />
        </div>
      </div>

      <p v-if="!history.length" class="results-panel__empty">{{ t("devtools.uuid.empty") }}</p>

      <ul v-else class="uuid-list">
        <li v-for="(uuid, index) in history" :key="`${uuid}-${index}`" class="uuid-list__item">
          <span class="uuid-list__value dc-mono">{{ uuid }}</span>
          <Button icon="pi pi-copy" text rounded :aria-label="t('devtools.uuid.copy')" @click="copy(uuid)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.uuid-page {
  padding: var(--dc-space-lg);
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--dc-space-lg);
}

.page-header__back {
  display: inline-flex;
  align-items: center;
  gap: var(--dc-space-3xs);
  margin-bottom: var(--dc-space-sm);
  color: var(--dc-text-muted);
  text-decoration: none;
  font-size: 0.8125rem;
}

.page-header__back:hover {
  color: var(--dc-text);
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  margin: 0 0 var(--dc-space-3xs);
  font-size: 1.375rem;
  font-weight: 600;
}

.page-header h1 i {
  color: var(--dc-accent);
  font-size: 1.125rem;
}

.page-header__subtitle {
  margin: 0;
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
}

.toolbar {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--dc-space-sm);
  margin-bottom: var(--dc-space-md);
  padding: var(--dc-space-md);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
}

.toolbar__field {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.toolbar :deep(.p-togglebutton) {
  border-color: var(--dc-panel-border-strong);
}

.toolbar :deep(.p-togglebutton.p-togglebutton-checked) {
  border-color: var(--dc-accent);
}

.toolbar :deep(.p-togglebutton.p-togglebutton-checked .p-togglebutton-content) {
  background: var(--dc-accent);
  box-shadow: none;
}

.toolbar :deep(.p-togglebutton.p-togglebutton-checked .p-togglebutton-label) {
  color: var(--dc-bg);
  font-weight: 600;
}

.results-panel {
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  padding: var(--dc-space-md);
}

.results-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dc-space-sm);
}

.results-panel__header h2 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.results-panel__actions {
  display: flex;
  gap: var(--dc-space-2xs);
}

.results-panel__empty {
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
  text-align: center;
  padding: var(--dc-space-lg) 0;
  margin: 0;
}

.uuid-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-height: 480px;
  overflow-y: auto;
}

.uuid-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-xs) var(--dc-space-2xs);
  border-bottom: 1px solid var(--dc-hairline);
}

.uuid-list__item:last-child {
  border-bottom: none;
}

.uuid-list__value {
  font-size: 0.8125rem;
  color: var(--dc-text);
  word-break: break-all;
}
</style>
