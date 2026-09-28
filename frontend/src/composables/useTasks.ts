import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { CreateTaskInput, UpdateTaskInput } from "@devcenter/shared";
import { tasksApi } from "@/services/tasks.js";
import { PROJECTS_KEY } from "./useProjects.js";

export const TASKS_KEY = ["tasks"];

export function useTasksQuery() {
  return useQuery({ queryKey: TASKS_KEY, queryFn: tasksApi.list });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
}
