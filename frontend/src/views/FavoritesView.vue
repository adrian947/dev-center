<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ToolCard from "@/components/devtools/ToolCard.vue";
import { useToolUsage } from "@/composables/useToolUsage.js";
import { DEV_TOOLS } from "@/data/devtools.js";

const { t } = useI18n();
const { favorites } = useToolUsage();

const favoriteTools = computed(() =>
  favorites.value.flatMap((toolId) => {
    const tool = DEV_TOOLS.find((candidate) => candidate.id === toolId);
    return tool ? [tool] : [];
  }),
);
</script>

<template>
  <div class="favorites-page">
    <header class="page-header">
      <h1>{{ t("favoritesPage.title") }}</h1>
      <p class="page-header__subtitle">{{ t("favoritesPage.subtitle") }}</p>
    </header>

    <div v-if="favoriteTools.length" class="tools-grid">
      <ToolCard v-for="tool in favoriteTools" :key="tool.id" :tool="tool" />
    </div>
    <p v-else class="favorites-page__empty">{{ t("favoritesPage.empty") }}</p>
  </div>
</template>

<style scoped>
.favorites-page {
  padding: var(--dc-space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--dc-space-lg);
}

.page-header h1 {
  margin: 0 0 var(--dc-space-3xs);
  font-size: 1.375rem;
  font-weight: 600;
}

.page-header__subtitle {
  margin: 0;
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--dc-space-md);
}

.favorites-page__empty {
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
  text-align: center;
  padding: var(--dc-space-xl) 0;
  margin: 0;
}
</style>
