import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { CreateProjectInput, UpdateProjectInput } from "@devcenter/shared";
import { projectsApi } from "@/services/projects.js";

export const PROJECTS_KEY = ["projects"];

export function useProjectsQuery() {
  return useQuery({ queryKey: PROJECTS_KEY, queryFn: projectsApi.list });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      projectsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
}
