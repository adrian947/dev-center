<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Chips from "primevue/chips";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import type { CreateNoteInput, Note } from "@devcenter/shared";
import { useCreateNote, useDeleteNote, useNotesQuery, useUpdateNote } from "@/composables/useNotes.js";
import { useProjectsQuery } from "@/composables/useProjects.js";

const { t, locale } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { data: notes, isLoading, isError, refetch } = useNotesQuery();
const { data: projects } = useProjectsQuery();

const createNote = useCreateNote();
const updateNote = useUpdateNote();
const deleteNote = useDeleteNote();

const searchQuery = ref("");
const projectFilter = ref<"ALL" | "NONE" | string>("ALL");
const pinnedFilter = ref<"ALL" | "PINNED" | "UNPINNED">("ALL");

const projectFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  { label: t("common.noProject"), value: "NONE" },
  ...(projects.value ?? []).map((project) => ({ label: project.name, value: project.id })),
]);

const pinnedFilterOptions = computed(() => [
  { label: t("common.all"), value: "ALL" },
  { label: t("notesPage.pin"), value: "PINNED" },
  { label: t("notesPage.unpin"), value: "UNPINNED" },
]);

const projectFormOptions = computed(() => [
  { label: t("common.noProject"), value: null },
  ...(projects.value ?? []).map((project) => ({ label: project.name, value: project.id })),
]);

function projectName(projectId: string | null): string | null {
  if (!projectId) return null;
  return projects.value?.find((project) => project.id === projectId)?.name ?? null;
}

const filteredNotes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return (notes.value ?? []).filter((note) => {
    if (
      query &&
      !note.title.toLowerCase().includes(query) &&
      !note.content.toLowerCase().includes(query)
    )
      return false;
    if (projectFilter.value === "NONE" && note.projectId !== null) return false;
    if (
      projectFilter.value !== "ALL" &&
      projectFilter.value !== "NONE" &&
      note.projectId !== projectFilter.value
    )
      return false;
    if (pinnedFilter.value === "PINNED" && !note.pinned) return false;
    if (pinnedFilter.value === "UNPINNED" && note.pinned) return false;
    return true;
  });
});

function excerpt(content: string): string {
  const trimmed = content.trim();
  return trimmed.length > 140 ? `${trimmed.slice(0, 140)}…` : trimmed;
}

function formattedDate(date: Date): string {
  return new Intl.DateTimeFormat(locale.value === "es" ? "es-AR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function togglePinned(note: Note): void {
  updateNote.mutate({ id: note.id, input: { pinned: !note.pinned } });
}

const dialogVisible = ref(false);
const editingNote = ref<Note | null>(null);

const emptyForm = (): CreateNoteInput => ({
  title: "",
  content: "",
  projectId: null,
  tags: [],
  pinned: false,
});

const form = reactive<CreateNoteInput>(emptyForm());

watch(dialogVisible, (visible) => {
  if (!visible) editingNote.value = null;
});

function openCreateDialog(): void {
  editingNote.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEditDialog(note: Note): void {
  editingNote.value = note;
  Object.assign(form, {
    title: note.title,
    content: note.content,
    projectId: note.projectId,
    tags: [...note.tags],
    pinned: note.pinned,
  });
  dialogVisible.value = true;
}

const isSaving = computed(() => createNote.isPending.value || updateNote.isPending.value);

function submitForm(): void {
  if (!form.title.trim() || !form.content.trim()) return;

  const payload: CreateNoteInput = {
    ...form,
    title: form.title.trim(),
    content: form.content.trim(),
  };

  if (editingNote.value) {
    updateNote.mutate(
      { id: editingNote.value.id, input: payload },
      {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("notesPage.toast.updated"), life: 2500 });
          dialogVisible.value = false;
        },
        onError: () => {
          toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
        },
      },
    );
  } else {
    createNote.mutate(payload, {
      onSuccess: () => {
        toast.add({ severity: "success", summary: t("notesPage.toast.created"), life: 2500 });
        dialogVisible.value = false;
      },
      onError: () => {
        toast.add({ severity: "error", summary: t("common.errorLoading"), life: 3000 });
      },
    });
  }
}

function confirmDelete(note: Note): void {
  confirm.require({
    header: t("common.confirmDeleteTitle"),
    message: t("notesPage.confirmDelete", { title: note.title }),
    icon: "pi pi-exclamation-triangle",
    acceptLabel: t("common.delete"),
    rejectLabel: t("common.cancel"),
    acceptProps: { severity: "danger" },
    accept: () => {
      deleteNote.mutate(note.id, {
        onSuccess: () => {
          toast.add({ severity: "success", summary: t("notesPage.toast.deleted"), life: 2500 });
        },
      });
    },
  });
}
</script>

<template>
  <div class="notes-page">
    <header class="page-header">
      <h1>{{ t("notesPage.title") }}</h1>
      <Button :label="t('notesPage.newNote')" icon="pi pi-plus" @click="openCreateDialog" />
    </header>

    <div class="toolbar">
      <span class="toolbar__search">
        <i class="pi pi-search" aria-hidden="true" />
        <InputText v-model="searchQuery" :placeholder="t('notesPage.searchPlaceholder')" />
      </span>
      <Select
        v-model="projectFilter"
        :options="projectFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('notesPage.filters.project')"
      />
      <Select
        v-model="pinnedFilter"
        :options="pinnedFilterOptions"
        option-label="label"
        option-value="value"
        :aria-label="t('notesPage.filters.pinned')"
      />
    </div>

    <div v-if="isLoading" class="state-panel">
      <ProgressSpinner style="width: 32px; height: 32px" stroke-width="4" />
    </div>

    <div v-else-if="isError" class="state-panel">
      <p>{{ t("common.errorLoading") }}</p>
      <Button :label="t('common.retry')" text @click="refetch()" />
    </div>

    <p v-else-if="filteredNotes.length === 0 && (notes?.length ?? 0) === 0" class="state-panel">
      {{ t("notesPage.empty") }}
    </p>

    <p v-else-if="filteredNotes.length === 0" class="state-panel">
      {{ t("notesPage.emptyFiltered") }}
    </p>

    <div v-else class="notes-grid">
      <article v-for="note in filteredNotes" :key="note.id" class="note-card">
        <div class="note-card__header">
          <h2 @click="openEditDialog(note)">{{ note.title }}</h2>
          <button
            type="button"
            class="note-card__pin"
            :class="{ 'note-card__pin--active': note.pinned }"
            :aria-label="note.pinned ? t('notesPage.unpin') : t('notesPage.pin')"
            @click="togglePinned(note)"
          >
            <i class="pi" :class="note.pinned ? 'pi-star-fill' : 'pi-star'" aria-hidden="true" />
          </button>
        </div>

        <p class="note-card__excerpt">{{ excerpt(note.content) }}</p>

        <div v-if="note.tags.length" class="note-card__tags">
          <Tag v-for="tag in note.tags" :key="tag" :value="tag" severity="secondary" />
        </div>

        <div class="note-card__footer">
          <span class="dc-mono">{{ formattedDate(note.updatedAt) }}</span>
          <span v-if="projectName(note.projectId)">{{ projectName(note.projectId) }}</span>
          <div class="note-card__actions">
            <Button icon="pi pi-pencil" text rounded @click="openEditDialog(note)" />
            <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(note)" />
          </div>
        </div>
      </article>
    </div>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      :header="editingNote ? t('notesPage.editNote') : t('notesPage.newNote')"
      :style="{ width: '36rem' }"
    >
      <form class="note-form" @submit.prevent="submitForm">
        <label class="note-form__field">
          <span>{{ t("notesPage.fields.title") }}</span>
          <InputText v-model="form.title" autofocus required />
        </label>

        <label class="note-form__field">
          <span>{{ t("notesPage.fields.content") }}</span>
          <Textarea v-model="form.content" :rows="8" auto-resize required />
        </label>

        <label class="note-form__field">
          <span>{{ t("notesPage.fields.project") }}</span>
          <Select
            v-model="form.projectId"
            :options="projectFormOptions"
            option-label="label"
            option-value="value"
            show-clear
          />
        </label>

        <label class="note-form__field">
          <span>{{ t("notesPage.fields.tags") }}</span>
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
.notes-page {
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

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--dc-space-md);
}

.note-card {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-xs);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  padding: var(--dc-space-md);
}

.note-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dc-space-sm);
}

.note-card__header h2 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dc-text);
  cursor: pointer;
}

.note-card__pin {
  background: none;
  border: none;
  padding: var(--dc-space-2xs);
  cursor: pointer;
  color: var(--dc-text-dim);
}

.note-card__pin--active {
  color: var(--dc-warning);
}

.note-card__excerpt {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
  flex: 1;
  white-space: pre-line;
}

.note-card__tags {
  display: flex;
  gap: var(--dc-space-2xs);
  flex-wrap: wrap;
}

.note-card__footer {
  display: flex;
  align-items: center;
  gap: var(--dc-space-sm);
  font-size: 0.75rem;
  color: var(--dc-text-muted);
  border-top: 1px solid var(--dc-hairline);
  padding-top: var(--dc-space-xs);
}

.note-card__actions {
  margin-left: auto;
  display: flex;
  gap: var(--dc-space-2xs);
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-sm);
}

.note-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--dc-space-2xs);
  font-size: 0.8125rem;
  color: var(--dc-text-muted);
}
</style>
