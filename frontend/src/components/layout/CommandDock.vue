<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useCommandPalette } from "@/composables/useCommandPalette.js";

const { t } = useI18n();
const route = useRoute();
const commandPalette = useCommandPalette();

const clock = ref(formatClock(new Date()));
let timer: number | undefined;

function formatClock(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

onMounted(() => {
  timer = window.setInterval(() => {
    clock.value = formatClock(new Date());
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});

const currentSectionKey = "dashboard";
</script>

<template>
  <footer class="command-dock">
    <span class="command-dock__section dc-mono">
      <span class="command-dock__dot" aria-hidden="true" />
      {{ t(`nav.${route.meta.navKey ?? currentSectionKey}`) }}
    </span>

    <button type="button" class="command-dock__trigger" @click="commandPalette.open()">
      <i class="pi pi-bolt" aria-hidden="true" />
      <span>{{ t("topbar.openCommandPalette") }}</span>
      <kbd class="dc-mono">⌘K</kbd>
    </button>

    <time class="command-dock__clock dc-mono">{{ clock }}</time>
  </footer>
</template>

<style scoped>
.command-dock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dc-space-md);
  height: var(--dc-strip-height);
  padding: 0 var(--dc-space-md);
  background: var(--dc-panel-bg);
  border-top: 1px solid var(--dc-panel-border);
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.command-dock__section {
  display: flex;
  align-items: center;
  gap: var(--dc-space-2xs);
  color: var(--dc-text);
}

.command-dock__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--dc-accent);
  box-shadow: 0 0 6px var(--dc-accent-glow);
}

.command-dock__trigger {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--dc-radius);
  padding: var(--dc-space-3xs) var(--dc-space-sm);
  color: var(--dc-text-muted);
  cursor: pointer;
}

.command-dock__trigger:hover {
  color: var(--dc-text);
  border-color: var(--dc-panel-border-strong);
}

.command-dock__trigger kbd {
  padding: 1px 5px;
  border: 1px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius);
  font-size: 0.6875rem;
}

.command-dock__clock {
  color: var(--dc-text-muted);
  letter-spacing: 0.02em;
}
</style>
