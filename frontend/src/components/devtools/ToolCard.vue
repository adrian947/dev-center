<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Tag from "primevue/tag";
import type { DevToolMeta } from "@/data/devtools.js";
import { useToolUsage } from "@/composables/useToolUsage.js";

defineProps<{ tool: DevToolMeta }>();

const { t } = useI18n();
const { isFavorite, toggleFavorite } = useToolUsage();
</script>

<template>
  <div class="tool-card-wrap">
    <component
      :is="tool.route ? 'RouterLink' : 'div'"
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
    <Button
      class="tool-card__star"
      :icon="isFavorite(tool.id) ? 'pi pi-star-fill' : 'pi pi-star'"
      text
      rounded
      size="small"
      :aria-pressed="isFavorite(tool.id)"
      :aria-label="
        t(isFavorite(tool.id) ? 'devtools.favorite.removeNamed' : 'devtools.favorite.addNamed', {
          name: t(`devtools.tools.${tool.id}`),
        })
      "
      @click="toggleFavorite(tool.id)"
    />
  </div>
</template>

<style scoped>
.tool-card-wrap {
  position: relative;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dc-space-xs);
  height: 100%;
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

.tool-card__star {
  position: absolute;
  top: var(--dc-space-2xs);
  right: var(--dc-space-2xs);
}
</style>
