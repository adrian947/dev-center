<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Tag from "primevue/tag";
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
      <component
        :is="tool.route ? 'RouterLink' : 'div'"
        v-for="tool in DEV_TOOLS"
        :key="tool.id"
        :to="tool.route"
        class="tool-card"
        :class="{ 'tool-card--active': tool.route }"
      >
        <i class="pi" :class="tool.icon" aria-hidden="true" />
        <span class="tool-card__name">{{ t(`devtools.tools.${tool.id}`) }}</span>
        <Tag
          :value="tool.route ? t('devtools.available') : t('devtools.comingSoon')"
          :severity="tool.route ? 'success' : 'secondary'"
        />
      </component>
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

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dc-space-xs);
  padding: var(--dc-space-lg) var(--dc-space-sm);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  text-align: center;
  text-decoration: none;
}

.tool-card--active {
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.tool-card--active:hover {
  border-color: var(--dc-accent);
  transform: translateY(-2px);
}

.tool-card i {
  font-size: 1.5rem;
  color: var(--dc-accent);
}

.tool-card__name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--dc-text);
}
</style>
