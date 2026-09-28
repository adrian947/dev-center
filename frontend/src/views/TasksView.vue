<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import Chips from "primevue/chips";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import type { CreateTaskInput, Task, TaskPriority, TaskStatus } from "@devcenter/shared";
import { TASK_PRIORITIES, TASK_STATUSES } from "@devcenter/shared";
import { useCreateTask, useDeleteTask, useTasksQuery, useUpdateTask } from "@/composables/useTasks.js";
import { useProjectsQuery } from "@/composables/useProjects.js";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { data: tasks, isLoading, isError, refetch } = useTasksQuery();
const { data: projects } = useProjectsQuery();

const createTask = useCreateTask();
const updateTask = useUpdateTask();
const deleteTask = useDeleteTask();

const searchQuery = ref("");
const statusFilter = ref<"ALL" | TaskStatus>("ALL");
const priorityFilter = ref<"ALL" | TaskPriority>("ALL");
const projectFilter = ref<"ALL" | "NONE" | string>("ALL");

const statusFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  ...TASK_STATUSES.map((status) => ({ label: t(`dashboard.status.${status}`), value: status })),
]);

const priorityFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  ...TASK_PRIORITIES.map((priority) => ({
    label: t(`dashboard.priority.${priority}`),
    value: priority,
  })),
]);

const projectFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  { label: t("common.noProject"), value: "NONE" },
  ...(projects.value ?? []).map((project) => ({ label: project.name, value: project.id })),
]);

const statusFormOptions = computed(() =>
  TASK_STATUSES.map((status) => ({ label: t(`dashboard.status.${status}`), value: status })),
);

const priorityFormOptions = computed(() =>
  TASK_PRIORITIES.map((priority) => ({ label: t(`dashboard.priority.${priority}`), value: priority })),
);

const projectFormOptions = computed(() => [
  { label: t("common.noProject"), value: null },
  ...(projects.value ?? []).map((project) => ({ label: project.name, value: project.id })),
]);

function projectName(projectId: string | null): string | null {
  if (!projectId) return null;
  return projects.value?.find((project) => project.id === projectId)?.name ?? null;
}

const filteredTasks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return (tasks.value ?? []).filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (statusFilter.value !== "ALL" && task.status !== statusFilter.value) return false;
    if (priorityFilter.value !== "ALL" && task.priority !== priorityFilter.value) return false;
    if (projectFilter.value === "NONE" && task.projectId !== null) return false;
    if (
      projectFilter.value !== "ALL" &&
      projectFilter.value !== "NONE" &&
      task.projectId !== projectFilter.value
    )
      return false;
    return true;
  });
});

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "DONE") return false;
  return new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();
}

function isDueToday(task: Task): boolean {
  if (!task.dueDate) return false;
  const due = new Date(task.dueDate);
  const now = new Date();
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
}

function priorityTagSeverity(priority: TaskPriority): string {
  if (priority === "HIGH") return "danger";
  if (priority === "MEDIUM") return "warn";
  return "secondary";
}

const dialogVisible = ref(false);
const editingTask = ref<Task | null>(null);

const emptyForm = (): CreateTaskInput => ({
  title: "",
  description: null,
  priority: "MEDIUM",
  dueDate: null,
  projectId: null,
  tags: [],
});

const form = reactive<CreateTaskInput>(emptyForm());

watch(dialogVisible, (visible) => {
  if (!visible) editingTask.value = null;
});

function openCreateDialog(): void {
  editingTask.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEditDialog(task: Task): void {
  editingTask.value = task;
  Object.assign(form, {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    projectId: task.projectId,
    tags: [...task.tags],
  });
  dialogVisible.value = true;
}

const isSaving = computed(() => createTask.isPending.value || updateTask.isPending.value);

function submitForm(): void {
  if (!form.title.trim()) return;

  const payload: CreateTaskInput = {
    ...form,
    title: form.title.trim(),
    description: form.description?.trim() ? form.description.trim() : null,
  };

  if (editingTask.value) {
    updateTask.mutate(
      { id: editingTask.value.id, input: payload },
      {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("tasksPage.toast.updated"), life: 2500 });
          dialogVisible.value = false;
        },
        onError: () => {
          toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
        },
      },
    );
  } else {
    createTask.mutate(payload, {
      onSuccess: () => {
        toast.add({ severity: "success", summary: t("tasksPage.toast.created"), life: 2500 });
        dialogVisible.value = false;
      },
      onError: () => {
        toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
      },
    });
  }
}

function onStatusChange(task: Task, status: TaskStatus): void {
  updateTask.mutate({ id: task.id, input: { status } });
}

function confirmDelete(task: Task): void {
  confirm.require({
    header: t("common.confirmDeleteTitle"),
    message: t("tasksPage.confirmDelete", { title: task.title }),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: t("common.delete"),
    rejectLabel: t("common.cancel"),
    acceptProps: { severity: "danger" },
    accept: () => {
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("tasksPage.toast.deleted"), life: 2500 });
        },
      });
    },
  });
}
</script>

<template>
  <div class="tasks-page">
    <header class="page-header">
      <h1>{{ t("tasksPage.title") }}</h1>
      <Button :label="t('tasksPage.newTask')" icon="pi pi-plus" @click="openCreateDialog" />
    </header>

    <div class="toolbar">
      <span class="toolbar__search">
        <i class="pi pi-search" aria-hidden="true" />
        <InputText v-model="searchQuery" :placeholder="t('tasksPage.searchPlaceholder')" />
      </span>
      <Select
        v-model="statusFilter"
        :options="statusFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('tasksPage.filters.status')"
      />
      <Select
        v-model="priorityFilter"
        :options="priorityFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('tasksPage.filters.priority')"
      />
      <Select
        v-model="projectFilter"
        :options="projectFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('tasksPage.filters.project')"
      />
    </div>

    <div v-if="isLoading" class="state-panel">
      <ProgressSpinner style="width: 32px; height: 32px" stroke-width="4" />
    </div>

    <div v-else-if="isError" class="state-panel">
      <p>{{ t("common.errorLoading") }}</p>
      <Button :label="t('common.retry')" text @click="refetch()" />
    </div>

    <p v-else-if="filteredTasks.length === 0 && (tasks?.length ?? 0) === 0" class="state-panel">
      {{ t("tasksPage.empty") }}
    </p>

    <p v-else-if="filteredTasks.length === 0" class="state-panel">
      {{ t("tasksPage.emptyFiltered") }}
    </p>

    <table v-else class="task-table">
      <thead>
        <tr>
          <th>{{ t("tasksPage.fields.title") }}</th>
          <th>{{ t("tasksPage.fields.status") }}</th>
          <th>{{ t("tasksPage.fields.priority") }}</th>
          <th>{{ t("tasksPage.fields.dueDate") }}</th>
          <th>{{ t("tasksPage.fields.project") }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in filteredTasks" :key="task.id">
          <td class="task-table__title">
            <span>{{ task.title }}</span>
            <div v-if="task.tags.length" class="task-table__tags">
              <Tag v-for="tag in task.tags" :key="tag" :value="tag" severity="secondary" />
            </div>
          </td>
          <td>
            <Select
              :model-value="task.status"
              :options="statusFormOptions"
              option-label="label"
              option-value="value"
              class="task-table__status-select"
              @update:model-value="(status: TaskStatus) => onStatusChange(task, status)"
            />
          </td>
          <td>
            <Tag :value="t(`dashboard.priority.${task.priority}`)" :severity="priorityTagSeverity(task.priority)" />
          </td>
          <td class="dc-mono" :class="{ 'task-table__due--alert': isOverdue(task) }">
            <span v-if="!task.dueDate">{{ t("dashboard.tasks.noDueDate") }}</span>
            <span v-else-if="isOverdue(task)">{{ t("dashboard.tasks.overdue") }}</span>
            <span v-else-if="isDueToday(task)">{{ t("dashboard.tasks.dueToday") }}</span>
            <span v-else>{{ new Date(task.dueDate).toLocaleDateString() }}</span>
          </td>
          <td>{{ projectName(task.projectId) ?? t("common.noProject") }}</td>
          <td>
            <div class="task-table__actions">
              <Button icon="pi pi-pencil" text rounded @click="openEditDialog(task)" />
              <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(task)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="editingTask ? t('tasksPage.editTask') : t('tasksPage.newTask')"
      :style="{ width: '32rem' }"
    >
      <form class="task-form" @submit.prevent="submitForm">
        <label class="task-form__field">
          <span>{{ t("tasksPage.fields.title") }}</span>
          <InputText v-model="form.title" autofocus required />
        </label>

        <label class="task-form__field">
          <span>{{ t("tasksPage.fields.description") }}</span>
          <Textarea v-model="form.description" :rows="3" auto-resize />
        </label>

        <div class="task-form__row">
          <label class="task-form__field">
            <span>{{ t("tasksPage.fields.priority") }}</span>
            <Select
              v-model="form.priority"
              :options="priorityFormOptions"
              option-label="label"
              option-value="value"
            />
          </label>

          <label class="task-form__field">
            <span>{{ t("tasksPage.fields.dueDate") }}</span>
            <DatePicker v-model="form.dueDate" show-icon icon-display="input" date-format="dd/mm/yy" />
          </label>
        </div>

        <label class="task-form__field">
          <span>{{ t("tasksPage.fields.project") }}</span>
          <Select
            v-model="form.projectId"
            :options="projectFormOptions"
            option-label="label"
            option-value="value"
            show-clear
          />
        </label>

        <label class="task-form__field">
          <span>{{ t("tasksPage.fields.tags") }}</span>
          <Chips v-model="form.tags" />
        </label>
      </form>

      <template #footer>
        <Button :label="t('common.cancel')" text @click="dialogVisible = false" />
        <Button :label="t('common.save')" :loading="isSaving" @click="submitForm" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.tasks-page {
  padding: var(--dc-space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--dc-space-md);
}

.page-header h1 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dc-space-sm);
  margin-bottom: var(--dc-space-md);
}

.toolbar__search {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  padding: 0 var(--dc-space-sm);
  height: var(--dc-control-height);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius);
  color: var(--dc-text-muted);
  flex: 1 1 220px;
  max-width: 320px;
}

.toolbar__search .p-inputtext {
  border: none;
  background: none;
  padding: 0;
  flex: 1;
}

.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dc-space-sm);
  padding: var(--dc-space-2xl) 0;
  color: var(--dc-text-muted);
  text-align: center;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  overflow: hidden;
}

.task-table th {
  text-align: left;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--dc-text-muted);
  padding: var(--dc-space-sm);
  border-bottom: 1px solid var(--dc-panel-border);
}

.task-table td {
  padding: var(--dc-space-sm);
  border-bottom: 1px solid var(--dc-hairline);
  font-size: 0.8125rem;
  vertical-align: middle;
}

.task-table tr:last-child td {
  border-bottom: none;
}

.task-table__title {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  color: var(--dc-text);
}

.task-table__tags {
  display: flex;
  gap: var(--dc-space-2xs);
  flex-wrap: wrap;
}

.task-table__status-select {
  width: 10rem;
}

.task-table__due--alert {
  color: var(--dc-danger);
}

.task-table__actions {
  display: flex;
  align-items: center;
  gap: var(--dc-space-2xs);
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-sm);
}

.task-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.task-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dc-space-sm);
}
</style>
