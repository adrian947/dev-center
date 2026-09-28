<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Select from "primevue/select";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/i18n.js";
import { useThemeStore } from "@/stores/theme.js";
import { useAuthStore } from "@/stores/auth.js";
import { useCommandPalette } from "@/composables/useCommandPalette.js";

const { t, locale } = useI18n();
const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const commandPalette = useCommandPalette();

const avatarLabel = computed(() => authStore.user?.name?.trim()?.[0]?.toUpperCase() ?? "?");

const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({ code, label: t(`language.${code}`) })),
);

function setLocale(code: SupportedLocale) {
  locale.value = code;
}

const accountMenu = ref();
const accountMenuItems = computed(() => [
  {
    label: t("topbar.logout"),
    icon: "pi pi-sign-out",
    command: async () => {
      await authStore.logout();
      router.push({ name: "login" });
    },
  },
]);

function toggleAccountMenu(event: Event) {
  accountMenu.value?.toggle(event);
}
</script>

<template>
  <header class="status-strip">
    <button
      type="button"
      class="status-strip__search"
      @click="commandPalette.open()"
    >
      <i class="pi pi-search" aria-hidden="true" />
      <span>{{ t("topbar.searchPlaceholder") }}</span>
      <kbd class="status-strip__kbd dc-mono">⌘K</kbd>
    </button>

    <div class="status-strip__actions">
      <Select
        input-id="locale-select"
        aria-labelledby="locale-select-label"
        :model-value="locale"
        :options="localeOptions"
        option-label="label"
        option-value="code"
        class="status-strip__locale"
        @update:model-value="setLocale"
      />
      <label id="locale-select-label" for="locale-select" class="sr-only">{{
        t("language.label")
      }}</label>

      <Button
        :aria-label="t('topbar.toggleTheme')"
        class="status-strip__theme-btn"
        text
        rounded
        :icon="themeStore.theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
        @click="themeStore.toggle()"
      />

      <button
        type="button"
        class="status-strip__avatar-trigger"
        :aria-label="t('topbar.account')"
        @click="toggleAccountMenu"
      >
        <Avatar v-if="authStore.user?.avatarUrl" :image="authStore.user.avatarUrl" shape="circle" />
        <Avatar v-else :label="avatarLabel" shape="circle" />
      </button>
      <Menu ref="accountMenu" :model="accountMenuItems" popup />
    </div>
  </header>
</template>

<style scoped>
.status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dc-space-md);
  height: 52px;
  padding: 0 var(--dc-space-md);
  background: var(--dc-panel-bg);
  border-bottom: 1px solid var(--dc-panel-border);
}

.status-strip__search {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  flex: 1 1 auto;
  min-width: 0;
  max-width: 420px;
  height: var(--dc-control-height);
  padding: 0 var(--dc-space-sm);
  background: var(--dc-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius);
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
}

.status-strip__search:hover {
  border-color: var(--dc-panel-border-strong);
  color: var(--dc-text);
}

.status-strip__search span {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-strip__kbd {
  padding: 1px 6px;
  border: 1px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius);
  font-size: 0.6875rem;
  color: var(--dc-text-muted);
}

.status-strip__actions {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  flex: 0 0 auto;
}

.status-strip__locale {
  width: 8.5rem;
  height: var(--dc-control-height);
}

.status-strip__locale :deep(.p-select-label) {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--dc-space-sm);
  font-size: 0.8125rem;
  box-sizing: border-box;
}

.status-strip__locale :deep(.p-select) {
  height: 100%;
  background: var(--dc-bg);
  border-color: var(--dc-panel-border);
  border-radius: var(--dc-radius);
}

.status-strip__locale :deep(.p-select:not(.p-disabled).p-focus) {
  border-color: var(--dc-accent);
  box-shadow: none;
}

@media (max-width: 640px) {
  .status-strip__search span {
    display: none;
  }

  .status-strip__kbd {
    display: none;
  }

  .status-strip__locale {
    width: 4.25rem;
  }
}

.status-strip__theme-btn {
  width: var(--dc-control-height);
  height: var(--dc-control-height);
}

.status-strip__avatar-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dc-control-height);
  height: var(--dc-control-height);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 999px;
}

.status-strip__avatar-trigger:focus-visible {
  outline: 2px solid var(--dc-accent);
  outline-offset: 2px;
}

.status-strip__avatar-trigger :deep(.p-avatar) {
  width: 100%;
  height: 100%;
  background: var(--dc-hairline);
  color: var(--dc-accent);
  font-family: var(--dc-font-mono);
  font-weight: 500;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style>
/* Account menu popup teleports to <body>, so it can't be reached by a scoped style. */
.p-menu {
  background: var(--dc-panel-bg-raised);
  border: 1px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius-lg);
  box-shadow: var(--dc-shadow-panel);
  min-width: 12rem;
  padding: var(--dc-space-2xs);
}

.p-menu .p-menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0;
  margin: 0;
}

.p-menu .p-menu-item-content {
  border-radius: var(--dc-radius);
}

.p-menu .p-menu-item-link {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  padding: var(--dc-space-xs) var(--dc-space-sm);
  color: var(--dc-text);
  font-size: 0.8125rem;
  font-family: var(--dc-font-sans);
  text-decoration: none;
  cursor: pointer;
}

.p-menu .p-menu-item-icon {
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
}

.p-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
  background: var(--dc-hairline);
}

.p-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon,
.p-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-label {
  color: var(--dc-accent);
}
</style>
