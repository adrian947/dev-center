<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();

interface NavItem {
  key: string;
  label: string;
  icon: string;
  to: string;
}

const items: NavItem[] = [
  { key: "dashboard", label: "nav.dashboard", icon: "pi-th-large", to: "/" },
  { key: "tasks", label: "nav.tasks", icon: "pi-check-square", to: "/tasks" },
  { key: "notes", label: "nav.notes", icon: "pi-file-edit", to: "/notes" },
  { key: "projects", label: "nav.projects", icon: "pi-folder", to: "/projects" },
  { key: "links", label: "nav.links", icon: "pi-link", to: "/links" },
  { key: "devtools", label: "nav.devtools", icon: "pi-wrench", to: "/devtools" },
  { key: "favorites", label: "nav.favorites", icon: "pi-star", to: "/favorites" },
  { key: "settings", label: "nav.settings", icon: "pi-cog", to: "/settings" },
];

function isActive(to: string): boolean {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}
</script>

<template>
  <nav class="nav-rail" aria-label="Navegación principal">
    <div class="nav-rail__brand dc-mono">
      <span class="nav-rail__brand-dot" aria-hidden="true" />
      <span class="nav-rail__brand-text">DEVCENTER</span>
    </div>

    <ul class="nav-rail__list">
      <li v-for="item in items" :key="item.key">
        <RouterLink
          :to="item.to"
          class="nav-rail__item"
          :class="{ 'nav-rail__item--active': isActive(item.to) }"
        >
          <span class="nav-rail__indicator" aria-hidden="true" />
          <i class="pi" :class="item.icon" aria-hidden="true" />
          <span class="nav-rail__label">{{ t(item.label) }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-rail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--dc-panel-bg);
  border-right: 1px solid var(--dc-panel-border);
}

.nav-rail__brand {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  padding: var(--dc-space-md);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--dc-text);
  border-bottom: 1px solid var(--dc-panel-border);
}

.nav-rail__brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--dc-accent);
  box-shadow: 0 0 6px var(--dc-accent-glow);
}

.nav-rail__list {
  list-style: none;
  margin: 0;
  padding: var(--dc-space-xs) 0;
  flex: 1;
  overflow-y: auto;
}

.nav-rail__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-xs) var(--dc-space-md);
  color: var(--dc-text-muted);
  text-decoration: none;
  font-size: 0.8125rem;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-rail__item:hover {
  color: var(--dc-text);
  background: var(--dc-hairline);
}

.nav-rail__item i {
  font-size: 0.9rem;
  width: 1rem;
  text-align: center;
}

.nav-rail__indicator {
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 60%;
  background: var(--dc-accent);
  transform: translateY(-50%) scaleY(0);
  transform-origin: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.nav-rail__item--active {
  color: var(--dc-text);
  background: var(--dc-hairline);
  font-weight: 500;
}

.nav-rail__item--active .nav-rail__indicator {
  transform: translateY(-50%) scaleY(1);
  box-shadow: 0 0 8px var(--dc-accent-glow);
}

@media (max-width: 860px) {
  .nav-rail__brand-text {
    display: none;
  }

  .nav-rail__label {
    display: none;
  }

  .nav-rail__item {
    justify-content: center;
    padding: var(--dc-space-sm) 0;
  }

  .nav-rail__brand {
    justify-content: center;
    padding: var(--dc-space-md) 0;
  }
}
</style>
