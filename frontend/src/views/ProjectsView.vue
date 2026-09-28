<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import type { CreateProjectInput, ProjectStatus, ProjectWithCounts } from "@devcenter/shared";
import { PROJECT_STATUSES } from "@devcenter/shared";
import {
  useCreateProject,
  useDeleteProject,
  useProjectsQuery,
  useUpdateProject,
} from "@/composables/useProjects.js";

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { data: projects, isLoading, isError, refetch } = useProjectsQuery();

const createProject = useCreateProject();
const updateProject = useUpdateProject();
const deleteProject = useDeleteProject();

const searchQuery = ref("");
const statusFilter = ref<"ALL" | ProjectStatus>("ALL");

const statusFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  ...PROJECT_STATUSES.map((status) => ({ label: t(`dashboard.projectStatus.${status}`), value: status })),
]);

const statusFormOptions = computed(() =>
  PROJECT_STATUSES.map((status) => ({ label: t(`dashboard.projectStatus.${status}`), value: status })),
);

const COLOR_PALETTE = ["#39ff6a", "#4a9eff", "#ffab4a", "#ff6b6b", "#b98cff", "#f5d90a"];

function projectTagSeverity(status: ProjectStatus): string {
  if (status === "ACTIVE") return "success";
  if (status === "PAUSED") return "warn";
  if (status === "ARCHIVED") return "secondary";
  return "info";
}

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return (projects.value ?? []).filter((project) => {
    if (query && !project.name.toLowerCase().includes(query)) return false;
    if (statusFilter.value !== "ALL" && project.status !== statusFilter.value) return false;
    return true;
  });
});

const dialogVisible = ref(false);
const editingProject = ref<ProjectWithCounts | null>(null);

const emptyForm = (): CreateProjectInput => ({
  name: "",
  description: null,
  color: null,
  status: "ACTIVE",
});

const form = reactive<CreateProjectInput>(emptyForm());

watch(dialogVisible, (visible) => {
  if (!visible) editingProject.value = null;
});

function openCreateDialog(): void {
  editingProject.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEditDialog(project: ProjectWithCounts): void {
  editingProject.value = project;
  Object.assign(form, {
    name: project.name,
    description: project.description,
    color: project.color,
    status: project.status,
  });
  dialogVisible.value = true;
}

const isSaving = computed(() => createProject.isPending.value || updateProject.isPending.value);

function submitForm(): void {
  if (!form.name.trim()) return;

  const payload: CreateProjectInput = {
    ...form,
    name: form.name.trim(),
    description: form.description?.trim() ? form.description.trim() : null,
  };

  if (editingProject.value) {
    updateProject.mutate(
      { id: editingProject.value.id, input: payload },
      {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("projectsPage.toast.updated"), life: 2500 });
          dialogVisible.value = false;
        },
        onError: () => {
          toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
        },
      },
    );
  } else {
    createProject.mutate(payload, {
      onSuccess: () => {
        toast.add({ severity: "success", summary: t("projectsPage.toast.created"), life: 2500 });
        dialogVisible.value = false;
      },
      onError: () => {
        toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
      },
    });
  }
}

function confirmDelete(project: ProjectWithCounts): void {
  confirm.require({
    header: t("common.confirmDeleteTitle"),
    message: t("projectsPage.confirmDelete", { name: project.name }),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: t("common.delete"),
    rejectLabel: t("common.cancel"),
    acceptProps: { severity: "danger" },
    accept: () => {
      deleteProject.mutate(project.id, {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("projectsPage.toast.deleted"), life: 2500 });
        },
      });
    },
  });
}
</script>

<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>{{ t("projectsPage.title") }}</h1>
      <Button :label="t('projectsPage.newProject')" icon="pi pi-plus" @click="openCreateDialog" />
    </header>

    <div class="toolbar">
      <span class="toolbar__search">
        <i class="pi pi-search" aria-hidden="true" />
        <InputText v-model="searchQuery" :placeholder="t('projectsPage.searchPlaceholder')" />
      </span>
      <Select
        v-model="statusFilter"
        :options="statusFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('projectsPage.filters.status')"
      />
    </div>

    <div v-if="isLoading" class="state-panel">
      <ProgressSpinner style="width: 32px; height: 32px" stroke-width="4" />
    </div>

    <div v-else-if="isError" class="state-panel">
      <p>{{ t("common.errorLoading") }}</p>
      <Button :label="t('common.retry')" text @click="refetch()" />
    </div>

    <p v-else-if="filteredProjects.length === 0 && (projects?.length ?? 0) === 0" class="state-panel">
      {{ t("projectsPage.empty") }}
    </p>

    <p v-else-if="filteredProjects.length === 0" class="state-panel">
      {{ t("projectsPage.emptyFiltered") }}
    </p>

    <div v-else class="projects-grid">
      <article
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        :style="project.color ? { borderLeftColor: project.color } : undefined"
      >
        <div class="project-card__header">
          <h2 @click="openEditDialog(project)">{{ project.name }}</h2>
          <Tag :value="t(`dashboard.projectStatus.${project.status}`)" :severity="projectTagSeverity(project.status)" />
        </div>

        <p v-if="project.description" class="project-card__description">{{ project.description }}</p>

        <div class="project-card__stats dc-mono">
          <span>{{ t("projectsPage.openTasks", { open: project.openTaskCount, total: project.taskCount }) }}</span>
          <span>{{ t("projectsPage.notesCount", { count: project.noteCount }) }}</span>
        </div>

        <div class="project-card__footer">
          <Button icon="pi pi-pencil" text rounded @click="openEditDialog(project)" />
          <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(project)" />
        </div>
      </article>
    </div>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="editingProject ? t('projectsPage.editProject') : t('projectsPage.newProject')"
      :style="{ width: '30rem' }"
    >
      <form class="project-form" @submit.prevent="submitForm">
        <label class="project-form__field">
          <span>{{ t("projectsPage.fields.name") }}</span>
          <InputText v-model="form.name" autofocus required />
        </label>

        <label class="project-form__field">
          <span>{{ t("projectsPage.fields.description") }}</span>
          <Textarea v-model="form.description" :rows="3" auto-resize />
        </label>

        <label class="project-form__field">
          <span>{{ t("projectsPage.fields.status") }}</span>
          <Select
            v-model="form.status"
            :options="statusFormOptions"
            option-label="label"
            option-value="value"
          />
        </label>

        <div class="project-form__field">
          <span>{{ t("projectsPage.fields.color") }}</span>
          <div class="color-swatches">
            <button
              type="button"
              class="color-swatch color-swatch--none"
              :class="{ 'color-swatch--active': !form.color }"
              :aria-label="t('common.none')"
              @click="form.color = null"
            >
              <i class="pi pi-ban" aria-hidden="true" />
            </button>
            <button
              v-for="color in COLOR_PALETTE"
              :key="color"
              type="button"
              class="color-swatch"
              :class="{ 'color-swatch--active': form.color === color }"
              :style="{ backgroundColor: color }"
              :aria-label="color"
              @click="form.color = color"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <Button :label="t('common.cancel')" text @click="dialogVisible = false" />
        <Button :label="t('common.save')" :loading="isSaving" @click="submitForm" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.projects-page {
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--dc-space-md);
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-sm);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-left: 3px solid var(--dc-panel-border-strong);
  border-radius: var(--dc-radius-lg);
  padding: var(--dc-space-md);
}

.project-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dc-space-sm);
}

.project-card__header h2 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dc-text);
  cursor: pointer;
}

.project-card__description {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
  flex: 1;
}

.project-card__stats {
  display: flex;
  gap: var(--dc-space-md);
  font-size: 0.75rem;
  color: var(--dc-text-muted);
}

.project-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--dc-space-2xs);
  border-top: 1px solid var(--dc-hairline);
  padding-top: var(--dc-space-xs);
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-sm);
}

.project-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}

.color-swatches {
  display: flex;
  gap: var(--dc-space-xs);
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
}

.color-swatch--none {
  background: var(--dc-bg);
  border-color: var(--dc-panel-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dc-text-muted);
  font-size: 0.6875rem;
}

.color-swatch--active {
  border-color: var(--dc-text);
}
</style>
