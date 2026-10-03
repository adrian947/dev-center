<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Tag from "primevue/tag";
import Button from "primevue/button";
import type { Task } from "@devcenter/shared";
import { useTasksQuery } from "@/composables/useTasks.js";
import { useNotesQuery } from "@/composables/useNotes.js";
import { useProjectsQuery } from "@/composables/useProjects.js";
import { useToolUsage } from "@/composables/useToolUsage.js";
import { DEV_TOOLS } from "@/data/devtools.js";

const { t, locale } = useI18n();
const router = useRouter();

const { data: tasksData, isLoading: tasksLoading } = useTasksQuery();
const { data: projectsData, isLoading: projectsLoading } = useProjectsQuery();
const { data: notesData, isLoading: notesLoading } = useNotesQuery();

const tasks = computed(() => tasksData.value ?? []);
const projects = computed(() => projectsData.value ?? []);
const notes = computed(() => notesData.value ?? []);

const { recents } = useToolUsage();

const recentTools = computed(() =>
  recents.value.flatMap((entry) => {
    const tool = DEV_TOOLS.find((candidate) => candidate.id === entry.toolId);
    return tool ? [tool] : [];
  }),
);

const now = new Date();

const greetingKey = computed(() => {
  const hour = now.getHours();
  if (hour < 12) return "dashboard.greetingMorning";
  if (hour < 20) return "dashboard.greetingAfternoon";
  return "dashboard.greetingEvening";
});

const formattedDate = computed(() =>
  new Intl.DateTimeFormat(locale.value === "es" ? "es-AR" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now),
);

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "DONE") return false;
  return new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();
}

function isDueToday(task: Task): boolean {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate);
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}

const pendingCount = computed(() => tasks.value.filter((task) => task.status !== "DONE").length);
const overdueCount = computed(() => tasks.value.filter(isOverdue).length);
const dueTodayCount = computed(() => tasks.value.filter(isDueToday).length);
const activeProjectsCount = computed(
  () => projects.value.filter((project) => project.status === "ACTIVE").length,
);

const readouts = computed(() => [
  { key: "pending", value: pendingCount.value, tone: "neutral" },
  { key: "overdue", value: overdueCount.value, tone: overdueCount.value > 0 ? "danger" : "neutral" },
  { key: "today", value: dueTodayCount.value, tone: "warning" },
  { key: "activeProjects", value: activeProjectsCount.value, tone: "accent" },
]);

const dashboardTasks = computed(() => {
  return [...tasks.value]
    .sort((a, b) => {
      const doneRank = (task: Task) => (task.status === "DONE" ? 1 : 0);
      if (doneRank(a) !== doneRank(b)) return doneRank(a) - doneRank(b);
      const overdueRank = (task: Task) => (isOverdue(task) ? 0 : 1);
      if (overdueRank(a) !== overdueRank(b)) return overdueRank(a) - overdueRank(b);
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 6);
});

const dashboardProjects = computed(() => {
  return [...projects.value]
    .sort((a, b) => (a.status === "ACTIVE" ? 0 : 1) - (b.status === "ACTIVE" ? 0 : 1))
    .slice(0, 5);
});

const dashboardNotes = computed(() => notes.value.slice(0, 4));

function projectName(projectId: string | null): string | null {
  if (!projectId) return null;
  return projects.value.find((project) => project.id === projectId)?.name ?? null;
}

function noteExcerpt(content: string): string {
  const trimmed = content.trim();
  return trimmed.length > 90 ? `${trimmed.slice(0, 90)}…` : trimmed;
}

function taskDueLabel(task: Task): string {
  if (!task.dueDate) return t("dashboard.tasks.noDueDate");
  if (isOverdue(task)) return t("dashboard.tasks.overdue");
  if (isDueToday(task)) return t("dashboard.tasks.dueToday");
  return new Intl.DateTimeFormat(locale.value === "es" ? "es-AR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(task.dueDate));
}

function priorityTagStyle(priority: string): string {
  if (priority === "HIGH") return "danger";
  if (priority === "MEDIUM") return "warn";
  return "secondary";
}

function projectTagStyle(status: string): string {
  if (status === "ACTIVE") return "success";
  if (status === "PAUSED") return "warn";
  return "secondary";
}
</script>

<template>
  <div class="dashboard">
    <header class="console-header">
      <div>
        <h1 class="console-header__greeting">{{ t(greetingKey) }}</h1>
        <p class="console-header__subtitle dc-mono">
          {{ t("dashboard.subtitle", { date: formattedDate }) }}
        </p>
      </div>

      <ul class="readout-row">
        <li
          v-for="readout in readouts"
          :key="readout.key"
          class="readout"
          :class="`readout--${readout.tone}`"
        >
          <span class="readout__value dc-mono">{{ readout.value }}</span>
          <span class="readout__label">{{ t(`dashboard.readouts.${readout.key}`) }}</span>
        </li>
      </ul>
    </header>

    <div class="dashboard__grid">
      <section class="panel panel--tasks">
        <div class="panel__header">
          <h2>{{ t("dashboard.tasks.title") }}</h2>
          <Button :label="t('dashboard.tasks.viewAll')" text size="small" @click="router.push('/tasks')" />
        </div>

        <p v-if="tasksLoading" class="panel__empty">{{ t("common.loading") }}</p>
        <table v-else-if="dashboardTasks.length" class="task-log">
          <tbody>
            <tr v-for="task in dashboardTasks" :key="task.id">
              <td class="task-log__status">
                <span
                  class="status-light"
                  :class="`status-light--${task.status.toLowerCase()}`"
                  :title="t(`dashboard.status.${task.status}`)"
                />
              </td>
              <td class="task-log__title">
                <span>{{ task.title }}</span>
                <span class="task-log__project dc-mono">{{
                  projectName(task.projectId) ?? t("dashboard.tasks.project")
                }}</span>
              </td>
              <td class="task-log__priority">
                <Tag
                  :value="t(`dashboard.priority.${task.priority}`)"
                  :severity="priorityTagStyle(task.priority)"
                />
              </td>
              <td
                class="task-log__due dc-mono"
                :class="{ 'task-log__due--alert': isOverdue(task) }"
              >
                {{ taskDueLabel(task) }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="panel__empty">{{ t("dashboard.tasks.empty") }}</p>
      </section>

      <section class="panel panel--projects">
        <div class="panel__header">
          <h2>{{ t("dashboard.projects.title") }}</h2>
          <Button :label="t('dashboard.projects.viewAll')" text size="small" @click="router.push('/projects')" />
        </div>

        <p v-if="projectsLoading" class="panel__empty">{{ t("common.loading") }}</p>
        <ul v-else-if="dashboardProjects.length" class="project-band">
          <li v-for="project in dashboardProjects" :key="project.id" class="project-band__item">
            <span class="project-band__name">{{ project.name }}</span>
            <span class="project-band__count dc-mono">
              {{
                t("dashboard.projects.openTasks", {
                  open: project.openTaskCount,
                  total: project.taskCount,
                })
              }}
            </span>
            <Tag
              :value="t(`dashboard.projectStatus.${project.status}`)"
              :severity="projectTagStyle(project.status)"
            />
          </li>
        </ul>
        <p v-else class="panel__empty">{{ t("dashboard.projects.empty") }}</p>
      </section>

      <section class="panel panel--notes">
        <div class="panel__header">
          <h2>{{ t("dashboard.notes.title") }}</h2>
          <Button :label="t('dashboard.notes.viewAll')" text size="small" @click="router.push('/notes')" />
        </div>

        <p v-if="notesLoading" class="panel__empty">{{ t("common.loading") }}</p>
        <ul v-else-if="dashboardNotes.length" class="note-margin">
          <li v-for="note in dashboardNotes" :key="note.id" class="note-margin__item">
            <span class="note-margin__title">{{ note.title }}</span>
            <span class="note-margin__excerpt">{{ noteExcerpt(note.content) }}</span>
          </li>
        </ul>
        <p v-else class="panel__empty">{{ t("dashboard.notes.empty") }}</p>
      </section>

      <section class="panel panel--tools">
        <div class="panel__header">
          <h2>{{ t("dashboard.tools.title") }}</h2>
          <Button :label="t('dashboard.tools.viewAll')" text size="small" />
        </div>

        <ul v-if="recentTools.length" class="qsl-wall">
          <li v-for="tool in recentTools" :key="tool.id">
            <component
              :is="tool.route ? 'RouterLink' : 'div'"
              :to="tool.route"
              class="qsl-wall__card"
            >
              <i class="pi" :class="tool.icon" aria-hidden="true" />
              <span>{{ t(`devtools.tools.${tool.id}`) }}</span>
            </component>
          </li>
        </ul>
        <p v-else class="panel__empty">{{ t("dashboard.tools.empty") }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--dc-space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

@keyframes console-boot {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.console-header,
.panel {
  animation: console-boot 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.console-header {
  animation-delay: 0ms;
}

.dashboard__grid > .panel:nth-of-type(1) {
  animation-delay: 60ms;
}

.dashboard__grid > .panel:nth-of-type(2) {
  animation-delay: 110ms;
}

.dashboard__grid > .panel:nth-of-type(3) {
  animation-delay: 160ms;
}

.dashboard__grid > .panel:nth-of-type(4) {
  animation-delay: 210ms;
}

@media (prefers-reduced-motion: reduce) {
  .console-header,
  .panel {
    animation: none;
  }
}

.console-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--dc-space-lg);
  padding-bottom: var(--dc-space-lg);
  margin-bottom: var(--dc-space-lg);
  border-bottom: 1px solid var(--dc-panel-border);
}

.console-header__greeting {
  margin: 0 0 var(--dc-space-3xs);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.console-header__subtitle {
  margin: 0;
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
  text-transform: capitalize;
}

.readout-row {
  display: flex;
  gap: var(--dc-space-sm);
  list-style: none;
  margin: 0;
  padding: 0;
}

.readout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--dc-space-xs) var(--dc-space-md);
  min-width: 84px;
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius);
  box-shadow: var(--dc-shadow-inset);
}

.readout__value {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--dc-text);
}

.readout--danger .readout__value {
  color: var(--dc-danger);
}

.readout--warning .readout__value {
  color: var(--dc-warning);
}

.readout--accent .readout__value {
  color: var(--dc-accent);
}

.readout__label {
  font-size: 0.6875rem;
  color: var(--dc-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "tasks tools"
    "projects notes";
  gap: var(--dc-space-lg);
}

.panel {
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  padding: var(--dc-space-md);
}

.panel--tasks {
  grid-area: tasks;
}

.panel--projects {
  grid-area: projects;
}

.panel--notes {
  grid-area: notes;
}

.panel--tools {
  grid-area: tools;
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dc-space-sm);
}

.panel__header h2 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.panel__empty {
  color: var(--dc-text-muted);
  font-size: 0.8125rem;
  padding: var(--dc-space-md) 0;
  margin: 0;
  text-align: center;
}

.task-log {
  width: 100%;
  border-collapse: collapse;
}

.task-log td {
  padding: var(--dc-space-xs) var(--dc-space-2xs);
  border-top: 1px solid var(--dc-hairline);
  font-size: 0.8125rem;
  vertical-align: middle;
}

.task-log tr:first-child td {
  border-top: none;
}

.task-log__status {
  width: 1.5rem;
}

.status-light {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--dc-text-dim);
}

.status-light--in_progress {
  background: var(--dc-warning);
  box-shadow: 0 0 6px var(--dc-warning-glow);
}

.status-light--done {
  background: var(--dc-accent);
  box-shadow: 0 0 6px var(--dc-accent-glow);
}

.task-log__title {
  display: flex;
  flex-direction: column;
  color: var(--dc-text);
}

.task-log__project {
  font-size: 0.6875rem;
  color: var(--dc-text-muted);
}

.task-log__priority {
  white-space: nowrap;
}

.task-log__due {
  text-align: right;
  white-space: nowrap;
  color: var(--dc-text-muted);
}

.task-log__due--alert {
  color: var(--dc-danger);
}

.project-band {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-xs);
}

.project-band__item {
  display: flex;
  align-items: center;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-xs) 0;
  border-top: 1px solid var(--dc-hairline);
}

.project-band__item:first-child {
  border-top: none;
}

.project-band__name {
  flex: 1;
  font-size: 0.8125rem;
  color: var(--dc-text);
}

.project-band__count {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.note-margin {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-sm);
}

.note-margin__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: var(--dc-space-sm);
  border-bottom: 1px solid var(--dc-hairline);
}

.note-margin__title {
  font-size: 0.8125rem;
  color: var(--dc-text);
  font-weight: 500;
}

.note-margin__excerpt {
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.qsl-wall {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--dc-space-xs);
}

.qsl-wall__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dc-space-2xs);
  padding: var(--dc-space-sm) var(--dc-space-xs);
  background: var(--dc-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius);
  font-size: 0.75rem;
  color: var(--dc-text-muted);
  text-align: center;
  text-decoration: none;
}

a.qsl-wall__card:hover {
  color: var(--dc-text);
  border-color: var(--dc-panel-border-strong);
}

.qsl-wall__card i {
  font-size: 1.125rem;
  color: var(--dc-accent);
}

@media (max-width: 1100px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "tasks"
      "projects"
      "notes"
      "tools";
  }
}

@media (max-width: 640px) {
  .console-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .readout-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .readout {
    min-width: 0;
  }
}
</style>
