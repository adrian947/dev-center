<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--dc-space-sm);
  margin-bottom: var(--dc-space-md);
  padding: var(--dc-space-md);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
}

.toolbar :deep(.toolbar__field) {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}
</style>
