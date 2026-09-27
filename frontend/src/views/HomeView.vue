<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Select from "primevue/select";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/i18n.js";
import { useThemeStore } from "@/stores/theme.js";

const { t, locale } = useI18n();
const themeStore = useThemeStore();

const localeOptions = SUPPORTED_LOCALES.map((code) => ({
  code,
  label: t(`language.${code}`),
}));

function setLocale(code: SupportedLocale) {
  locale.value = code;
}
</script>

<template>
  <main class="home">
    <h1>{{ t("home.title") }}</h1>
    <p>{{ t("home.subtitle") }}</p>

    <div class="home__controls">
      <label id="locale-select-label" for="locale-select">{{ t("language.label") }}</label>
      <Select
        input-id="locale-select"
        aria-labelledby="locale-select-label"
        :model-value="locale"
        :options="localeOptions"
        option-label="label"
        option-value="code"
        @update:model-value="setLocale"
      />

      <Button
        :label="themeStore.theme === 'dark' ? 'Light' : 'Dark'"
        icon="pi pi-moon"
        @click="themeStore.toggle()"
      />
    </div>
  </main>
</template>

<style scoped>
.home {
  padding: var(--dc-spacing-lg);
}

.home__controls {
  display: flex;
  align-items: center;
  gap: var(--dc-spacing-md);
  margin-top: var(--dc-spacing-lg);
}
</style>
