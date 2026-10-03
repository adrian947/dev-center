<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { BASE64_EXAMPLE } from "@/utils/devtools/examples.js";
import { decodeBase64, encodeBase64 } from "@/utils/devtools/base64.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const urlSafe = ref(false);

const encode = () => run(() => ({ ok: true, value: encodeBase64(input.value, urlSafe.value) }));
const decode = () => run(() => decodeBase64(input.value));

function loadExample(): void {
  input.value = BASE64_EXAMPLE;
  void encode();
}
</script>

<template>
  <ToolLayout tool-id="base64" icon="pi-sync" :description="t('devtools.base64.description')" wide>
    <ToolToolbar>
      <Button :label="t('devtools.base64.encode')" icon="pi pi-arrow-right" @click="encode" />
      <Button
        :label="t('devtools.base64.decode')"
        icon="pi pi-arrow-left"
        severity="secondary"
        @click="decode"
      />
      <ToggleButton
        v-model="urlSafe"
        :on-label="t('devtools.base64.urlSafe')"
        :off-label="t('devtools.base64.urlSafe')"
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

    <TextIOPanel v-model="input" :output="output" :error="error" @submit="encode" />
  </ToolLayout>
</template>
