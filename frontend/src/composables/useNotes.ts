import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { CreateNoteInput, UpdateNoteInput } from "@devcenter/shared";
import { notesApi } from "@/services/notes.js";
import { PROJECTS_KEY } from "./useProjects.js";

export const NOTES_KEY = ["notes"];

export function useNotesQuery() {
  return useQuery({ queryKey: NOTES_KEY, queryFn: notesApi.list });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNoteInput) => notesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) =>
      notesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}
