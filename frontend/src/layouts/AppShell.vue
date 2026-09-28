<script setup lang="ts">
import NavRail from "@/components/layout/NavRail.vue";
import StatusStrip from "@/components/layout/StatusStrip.vue";
import CommandDock from "@/components/layout/CommandDock.vue";
import CommandPalette from "@/components/CommandPalette.vue";
import { useCommandPaletteHotkey } from "@/composables/useCommandPalette.js";

useCommandPaletteHotkey();
</script>

<template>
  <div class="app-shell">
    <NavRail class="app-shell__nav" />
    <div class="app-shell__column">
      <StatusStrip />
      <main class="app-shell__main">
        <router-view />
      </main>
      <CommandDock />
    </div>
    <CommandPalette />
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: var(--dc-nav-width) 1fr;
  height: 100vh;
}

.app-shell__nav {
  grid-row: 1;
}

.app-shell__column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
}

.app-shell__main {
  flex: 1;
  overflow-y: auto;
  background: var(--dc-bg);
}

@media (max-width: 860px) {
  .app-shell {
    grid-template-columns: 56px 1fr;
  }
}
</style>
