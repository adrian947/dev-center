<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { CSS_EXAMPLE } from "@/utils/devtools/examples.js";
import {
  CODE_LANGUAGES,
  sizeStats,
  transformCode,
  type CodeAction,
  type CodeLanguage,
  type SizeStats,
} from "@/utils/devtools/minifierBeautifier.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const language = ref<CodeLanguage>("css");
const languageOptions = CODE_LANGUAGES.map((value) => ({ label: value.toUpperCase(), value }));
const stats = ref<SizeStats | null>(null);

async function execute(action: CodeAction): Promise<void> {
  const ok = await run(() => transformCode(input.value, language.value, action));
  stats.value = ok ? sizeStats(input.value, output.value) : null;
}

function loadExample(): void {
  language.value = "css";
  input.value = CSS_EXAMPLE;
  void execute("minify");
}

const minify = () => execute("minify");
const beautify = () => execute("beautify");

function onClear(): void {
  clear();
  stats.value = null;
}
</script>

<template>
  <ToolLayout
    tool-id="minifierBeautifier"
    icon="pi-expand"
    :description="t('devtools.minifierBeautifier.description')"
    wide
  >
    <ToolToolbar>
      <div class="toolbar__field">
        <span>{{ t("devtools.minifierBeautifier.language") }}</span>
        <SelectButton
          v-model="language"
          :options="languageOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
        />
      </div>
      <Button
        :label="t('devtools.minifierBeautifier.minify')"
        icon="pi pi-compress"
        @click="minify"
      />
      <Button
        :label="t('devtools.minifierBeautifier.beautify')"
        icon="pi pi-align-left"
        severity="secondary"
        @click="beautify"
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

    <p v-if="stats" class="stats" role="status">
      {{
        t("devtools.minifierBeautifier.stats", {
          before: stats.before,
          after: stats.after,
          percent: stats.savedPercent.toFixed(1),
        })
      }}
    </p>

    <TextIOPanel v-model="input" :output="output" :error="error" />
  </ToolLayout>
</template>

<style scoped>
.stats {
  margin: 0 0 var(--dc-space-sm);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}
</style>
