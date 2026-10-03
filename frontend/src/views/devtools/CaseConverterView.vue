<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import { CASE_EXAMPLE } from "@/utils/devtools/examples.js";
import { CASE_KEYS, convertAllCases } from "@/utils/devtools/caseConverter.js";
import { byteLength, MAX_INPUT_BYTES } from "@/utils/devtools/result.js";

const { t } = useI18n();
const toast = useToast();

const input = ref("");

const tooLarge = computed(() => byteLength(input.value) > MAX_INPUT_BYTES);
const results = computed(() =>
  input.value && !tooLarge.value ? convertAllCases(input.value) : null,
);

function loadExample(): void {
  input.value = CASE_EXAMPLE;
}

async function copy(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
  toast.add({ severity: "success", summary: t("devtools.common.copied"), life: 1500 });
}
</script>

<template>
  <ToolLayout
    tool-id="caseConverter"
    icon="pi-sort-alpha-down"
    :description="t('devtools.caseConverter.description')"
  >
    <label class="field" for="case-input">
      <span>{{ t("devtools.common.input") }}</span>
      <Textarea
        id="case-input"
        v-model="input"
        class="dc-mono"
        rows="4"
        spellcheck="false"
        :placeholder="t('devtools.caseConverter.placeholder')"
      />
    </label>

    <Button
      :label="t('devtools.common.example')"
      icon="pi pi-lightbulb"
      severity="help"
      outlined
      class="example-btn"
      @click="loadExample"
    />

    <p v-if="tooLarge" class="error" role="alert">{{ t("devtools.common.errors.tooLarge") }}</p>

    <p v-if="!input" class="empty">{{ t("devtools.caseConverter.empty") }}</p>

    <ul v-if="results" class="results">
      <li v-for="key in CASE_KEYS" :key="key" class="results__item">
        <div class="results__text">
          <span class="results__label">{{ t(`devtools.caseConverter.cases.${key}`) }}</span>
          <span class="results__value dc-mono">{{ results[key] }}</span>
        </div>
        <Button
          icon="pi pi-copy"
          text
          rounded
          :aria-label="t('devtools.common.copy')"
          @click="copy(results[key])"
        />
      </li>
    </ul>
  </ToolLayout>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  margin-bottom: var(--dc-space-md);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.field :deep(textarea) {
  width: 100%;
  font-family: var(--dc-font-mono);
  font-size: 0.8125rem;
}

.example-btn {
  margin-bottom: var(--dc-space-md);
}

.empty,
.error {
  margin: 0 0 var(--dc-space-md);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.error {
  color: var(--dc-danger);
}

.results {
  list-style: none;
  margin: 0;
  padding: var(--dc-space-md);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
}

.results__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-xs) 0;
  border-bottom: 1px solid var(--dc-hairline);
}

.results__item:last-child {
  border-bottom: none;
}

.results__text {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-3xs);
  min-width: 0;
}

.results__label {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.results__value {
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
