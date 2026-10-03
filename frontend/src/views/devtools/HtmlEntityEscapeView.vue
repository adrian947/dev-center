<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { HTML_ENTITIES_EXAMPLE } from "@/utils/devtools/examples.js";
import {
  escapeHtml,
  escapeJsonString,
  unescapeHtml,
  unescapeJsonString,
} from "@/utils/devtools/htmlEntities.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const nonAscii = ref(false);

const escapeHtmlAction = () =>
  run(() => ({ ok: true, value: escapeHtml(input.value, nonAscii.value) }));
const unescapeHtmlAction = () => run(() => ({ ok: true, value: unescapeHtml(input.value) }));
const escapeJsonAction = () => run(() => ({ ok: true, value: escapeJsonString(input.value) }));
const unescapeJsonAction = () => run(() => unescapeJsonString(input.value));

function loadExample(): void {
  input.value = HTML_ENTITIES_EXAMPLE;
  void escapeHtmlAction();
}
</script>

<template>
  <ToolLayout
    tool-id="htmlEntityEscape"
    icon="pi-language"
    :description="t('devtools.htmlEntityEscape.description')"
    wide
  >
    <ToolToolbar>
      <Button :label="t('devtools.htmlEntityEscape.escapeHtml')" @click="escapeHtmlAction" />
      <Button
        :label="t('devtools.htmlEntityEscape.unescapeHtml')"
        severity="secondary"
        @click="unescapeHtmlAction"
      />
      <Button
        :label="t('devtools.htmlEntityEscape.escapeJson')"
        severity="secondary"
        @click="escapeJsonAction"
      />
      <Button
        :label="t('devtools.htmlEntityEscape.unescapeJson')"
        severity="secondary"
        @click="unescapeJsonAction"
      />
      <ToggleButton
        v-model="nonAscii"
        :on-label="t('devtools.htmlEntityEscape.nonAscii')"
        :off-label="t('devtools.htmlEntityEscape.nonAscii')"
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
        @click="clear"
      />
    </ToolToolbar>

    <TextIOPanel v-model="input" :output="output" :error="error" @submit="escapeHtmlAction" />
  </ToolLayout>
</template>
