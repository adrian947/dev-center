<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Dialog from "primevue/dialog";
import { useCommandPalette } from "@/composables/useCommandPalette.js";

const { t } = useI18n();
const router = useRouter();
const commandPalette = useCommandPalette();

interface PaletteEntry {
  id: string;
  label: string;
  icon: string;
  to: string;
}

const entries: PaletteEntry[] = [
  { id: "dashboard", label: "nav.dashboard", icon: "pi-th-large", to: "/" },
  { id: "tasks", label: "nav.tasks", icon: "pi-check-square", to: "/tasks" },
  { id: "notes", label: "nav.notes", icon: "pi-file-edit", to: "/notes" },
  { id: "projects", label: "nav.projects", icon: "pi-folder", to: "/projects" },
  { id: "links", label: "nav.links", icon: "pi-link", to: "/links" },
  { id: "devtools", label: "nav.devtools", icon: "pi-wrench", to: "/devtools" },
  { id: "favorites", label: "nav.favorites", icon: "pi-star", to: "/favorites" },
  { id: "settings", label: "nav.settings", icon: "pi-cog", to: "/settings" },
];

const query = ref("");
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement>();

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((entry) => t(entry.label).toLowerCase().includes(q));
});

watch(filtered, () => {
  activeIndex.value = 0;
});

watch(
  () => commandPalette.isOpen.value,
  async (open) => {
    if (open) {
      query.value = "";
      activeIndex.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  },
);

function select(entry: PaletteEntry) {
  router.push(entry.to);
  commandPalette.close();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % Math.max(filtered.value.length, 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + filtered.value.length) % Math.max(filtered.value.length, 1);
  } else if (event.key === "Enter") {
    const entry = filtered.value[activeIndex.value];
    if (entry) select(entry);
  }
}
</script>

<template>
  <Dialog
    :visible="commandPalette.isOpen.value"
    modal
    :draggable="false"
    :closable="false"
    :dismissable-mask="true"
    class="command-palette"
    :pt="{ content: { class: 'command-palette__content' } }"
    @update:visible="(v: boolean) => !v && commandPalette.close()"
  >
    <div class="command-palette__body">
      <div class="command-palette__input-row">
        <i class="pi pi-search" aria-hidden="true" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="command-palette__input dc-mono"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-palette-listbox"
          :aria-activedescendant="
            filtered[activeIndex] ? `command-palette-option-${filtered[activeIndex].id}` : undefined
          "
          :aria-label="t('commandPalette.placeholder')"
          :placeholder="t('commandPalette.placeholder')"
          @keydown="onKeydown"
        />
      </div>

      <p v-if="filtered.length === 0" class="command-palette__empty">
        {{ t("commandPalette.empty") }}
      </p>

      <ul v-else id="command-palette-listbox" class="command-palette__list" role="listbox">
        <li class="command-palette__group" role="presentation">{{ t("commandPalette.groupNav") }}</li>
        <li
          v-for="(entry, index) in filtered"
          :id="`command-palette-option-${entry.id}`"
          :key="entry.id"
          role="option"
          :aria-selected="index === activeIndex"
          class="command-palette__item"
          :class="{ 'command-palette__item--active': index === activeIndex }"
          @mouseenter="activeIndex = index"
          @click="select(entry)"
        >
          <i class="pi" :class="entry.icon" aria-hidden="true" />
          <span>{{ t(entry.label) }}</span>
        </li>
      </ul>

      <div class="command-palette__footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> {{ t("commandPalette.hint") }}</span>
        <span><kbd>↵</kbd> {{ t("commandPalette.hintSelect") }}</span>
        <span><kbd>Esc</kbd> {{ t("commandPalette.hintClose") }}</span>
      </div>
    </div>
  </Dialog>
</template>

<style>
.command-palette {
  width: 100%;
  max-width: 560px;
  background: var(--dc-panel-bg-raised);
  border: 1px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius-lg);
  box-shadow: var(--dc-shadow-panel);
}

.command-palette .p-dialog-header {
  display: none;
}

.command-palette__content {
  padding: 0 !important;
  background: transparent;
}
</style>

<style scoped>
.command-palette__input-row {
  display: flex;
  align-items: center;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-md);
  border-bottom: 1px solid var(--dc-panel-border);
  color: var(--dc-text-muted);
}

.command-palette__input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--dc-text);
  font-size: 0.9375rem;
}

.command-palette__empty {
  padding: var(--dc-space-lg);
  color: var(--dc-text-muted);
  text-align: center;
  margin: 0;
}

.command-palette__list {
  list-style: none;
  margin: 0;
  padding: var(--dc-space-2xs) 0;
  max-height: 320px;
  overflow-y: auto;
}

.command-palette__group {
  padding: var(--dc-space-xs) var(--dc-space-md) var(--dc-space-2xs);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dc-text-muted);
}

.command-palette__item {
  display: flex;
  align-items: center;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-xs) var(--dc-space-md);
  color: var(--dc-text);
  cursor: pointer;
  font-size: 0.875rem;
}

.command-palette__item i {
  color: var(--dc-text-muted);
  width: 1rem;
  text-align: center;
}

.command-palette__item--active {
  background: var(--dc-hairline);
}

.command-palette__item--active i {
  color: var(--dc-accent);
}

.command-palette__footer {
  display: flex;
  gap: var(--dc-space-md);
  padding: var(--dc-space-xs) var(--dc-space-md);
  border-top: 1px solid var(--dc-panel-border);
  font-size: 0.6875rem;
  color: var(--dc-text-muted);
}

.command-palette__footer kbd {
  padding: 1px 5px;
  border: 1px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius);
  margin-right: 2px;
}
</style>
