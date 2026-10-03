<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Select from "primevue/select";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { CSV_EXAMPLE } from "@/utils/devtools/examples.js";
import {
  convertData,
  DATA_FORMATS,
  type CsvDelimiter,
  type DataFormat,
} from "@/utils/devtools/dataFormat.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const from = ref<DataFormat>("csv");
const to = ref<DataFormat>("json");
const delimiter = ref<CsvDelimiter>(",");

const formatOptions = DATA_FORMATS.map((format) => ({
  label: format.toUpperCase(),
  value: format,
}));
const delimiterOptions = computed(() => [
  { label: t("devtools.dataFormatConverter.delimiters.comma"), value: "," },
  { label: t("devtools.dataFormatConverter.delimiters.semicolon"), value: ";" },
  { label: t("devtools.dataFormatConverter.delimiters.tab"), value: "\t" },
]);
const usesCsv = computed(() => from.value === "csv" || to.value === "csv");

const convert = () =>
  run(() => convertData(input.value, from.value, to.value, { delimiter: delimiter.value }));

function loadExample(): void {
  from.value = "csv";
  to.value = "json";
  delimiter.value = ",";
  input.value = CSV_EXAMPLE;
  void convert();
}

function swap(): void {
  [from.value, to.value] = [to.value, from.value];
  if (output.value) {
    input.value = output.value;
    output.value = "";
  }
}
</script>

<template>
  <ToolLayout
    tool-id="dataFormatConverter"
    icon="pi-table"
    :description="t('devtools.dataFormatConverter.description')"
    wide
  >
    <ToolToolbar>
      <label class="toolbar__field">
        <span>{{ t("devtools.dataFormatConverter.from") }}</span>
        <Select v-model="from" :options="formatOptions" option-label="label" option-value="value" />
      </label>
      <Button
        icon="pi pi-arrow-right-arrow-left"
        text
        rounded
        :aria-label="t('devtools.dataFormatConverter.swap')"
        @click="swap"
      />
      <label class="toolbar__field">
        <span>{{ t("devtools.dataFormatConverter.to") }}</span>
        <Select v-model="to" :options="formatOptions" option-label="label" option-value="value" />
      </label>
      <label v-if="usesCsv" class="toolbar__field">
        <span>{{ t("devtools.dataFormatConverter.delimiter") }}</span>
        <Select
          v-model="delimiter"
          :options="delimiterOptions"
          option-label="label"
          option-value="value"
        />
      </label>
      <Button
        :label="t('devtools.dataFormatConverter.convert')"
        icon="pi pi-play"
        @click="convert"
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

    <TextIOPanel v-model="input" :output="output" :error="error" @submit="convert" />
  </ToolLayout>
</template>
