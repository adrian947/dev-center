<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import type { ToolId } from "@devcenter/shared";
import { useToolUsage } from "@/composables/useToolUsage.js";

const props = defineProps<{
  toolId: ToolId;
  icon: string;
  description?: string;
}>();

const { t } = useI18n();
const { isFavorite, toggleFavorite, trackUse } = useToolUsage();

onMounted(() => trackUse(props.toolId));
</script>

<template>
  <div class="tool-page">
    <header class="page-header">
      <div>
        <RouterLink to="/devtools" class="page-header__back">
          <i class="pi pi-arrow-left" aria-hidden="true" />
          {{ t("devtools.backToToolbox") }}
        </RouterLink>
        <h1><i class="pi" :class="icon" aria-hidden="true" /> {{ t(`devtools.tools.${toolId}`) }}</h1>
        <p v-if="description" class="page-header__subtitle">{{ description }}</p>
      </div>
      <div class="page-header__actions">
        <slot name="actions" />
        <Button
          :icon="isFavorite(toolId) ? 'pi pi-star-fill' : 'pi pi-star'"
          text
          rounded
          :aria-pressed="isFavorite(toolId)"
          :aria-label="isFavorite(toolId) ? t('devtools.favorite.remove') : t('devtools.favorite.add')"
          @click="toggleFavorite(toolId)"
        />
      </div>
    </header>

    <slot />
  </div>
</template>

<style scoped>
.tool-page {
  padding: var(--dc-space-lg);
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dc-space-sm);
  margin-bottom: var(--dc-space-lg);
}

.page-header__back {
  display: inline-flex;
  align-items: center;
  gap: var(--dc-space-3xs);
  margin-bottom: var(--dc-space-sm);
  color: var(--dc-text-muted);
  text-decoration: none;
  font-size: 0.8125rem;
}

.page-header__back:hover {
  color: var(--dc-text);
}

.page-header h1 {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  margin: 0 0 var(--dc-space-3xs);
  font-size: 1.375rem;
  font-weight: 600;
}

.page-header h1 i {
  color: var(--dc-accent);
  font-size: 1.125rem;
}

.page-header__subtitle {
  margin: 0;
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--dc-space-2xs);
}
</style>
