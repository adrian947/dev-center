<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const navKey = (route.meta.navKey as string) ?? "dashboard";
</script>

<template>
  <div class="coming-soon">
    <i class="pi pi-hourglass" aria-hidden="true" />
    <h1>{{ t(`nav.${navKey}`) }}</h1>
    <p class="coming-soon__title">{{ t("comingSoon.title") }}</p>
    <p class="coming-soon__subtitle">{{ t("comingSoon.subtitle") }}</p>
  </div>
</template>

<style scoped>
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dc-space-xs);
  height: 100%;
  padding: var(--dc-space-xl);
  text-align: center;
  color: var(--dc-text-muted);
}

.coming-soon i {
  font-size: 2rem;
  color: var(--dc-text-dim);
  margin-bottom: var(--dc-space-sm);
}

.coming-soon h1 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--dc-text);
}

.coming-soon__title {
  margin: 0;
  font-weight: 500;
}

.coming-soon__subtitle {
  margin: 0;
  font-size: 0.875rem;
  max-width: 32ch;
}
</style>
