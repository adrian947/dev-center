<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ToolCard from "@/components/devtools/ToolCard.vue";
import { DEV_TOOLS } from "@/data/devtools.js";

const { t } = useI18n();
</script>

<template>
  <div class="devtools-page">
    <header class="page-header">
      <div>
        <h1>{{ t("devtools.title") }}</h1>
        <p class="page-header__subtitle">{{ t("devtools.subtitle") }}</p>
      </div>
    </header>

    <div class="tools-grid">
      <ToolCard v-for="tool in DEV_TOOLS" :key="tool.id" :tool="tool" />
    </div>
  </div>
</template>

<style scoped>
.devtools-page {
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
</style>
