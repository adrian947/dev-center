<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";
import ToolLayout from "@/components/devtools/ToolLayout.vue";
import ToolToolbar from "@/components/devtools/ToolToolbar.vue";
import TextIOPanel from "@/components/devtools/TextIOPanel.vue";
import { useToolIO } from "@/composables/useToolIO.js";
import { SQL_EXAMPLE } from "@/utils/devtools/examples.js";
import { formatSql, SQL_DIALECTS, type SqlDialect } from "@/utils/devtools/sqlFormatter.js";

const { t } = useI18n();
const { input, output, error, run, clear } = useToolIO();

const dialect = ref<SqlDialect>("sql");
const uppercase = ref(true);
const indent = ref<2 | 4>(2);

const dialectOptions = SQL_DIALECTS.map((value) => ({ label: value, value }));
const indentOptions = [
  { label: "2", value: 2 },
  { label: "4", value: 4 },
];

const format = () =>
  run(() =>
    formatSql(input.value, {
      dialect: dialect.value,
      uppercaseKeywords: uppercase.value,
      indent: indent.value,
    }),
  );

function loadExample(): void {
  input.value = SQL_EXAMPLE;
  void format();
}
</script>

<template>
  <ToolLayout
    tool-id="sqlFormatter"
    icon="pi-database"
    :description="t('devtools.sqlFormatter.description')"
    wide
  >
    <ToolToolbar>
      <label class="toolbar__field">
        <span>{{ t("devtools.sqlFormatter.dialect") }}</span>
        <Select
          v-model="dialect"
          :options="dialectOptions"
          option-label="label"
          option-value="value"
        />
      </label>
      <div class="toolbar__field">
        <span>{{ t("devtools.sqlFormatter.indent") }}</span>
        <SelectButton
          v-model="indent"
          :options="indentOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
        />
      </div>
      <ToggleButton
        v-model="uppercase"
        :on-label="t('devtools.sqlFormatter.uppercase')"
        :off-label="t('devtools.sqlFormatter.uppercase')"
      />
      <Button :label="t('devtools.sqlFormatter.format')" icon="pi pi-align-left" @click="format" />
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

    <TextIOPanel
      v-model="input"
      :output="output"
      :error="error"
      :placeholder="t('devtools.sqlFormatter.placeholder')"
      @submit="format"
    />
  </ToolLayout>
</template>
