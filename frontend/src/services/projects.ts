import type {
  CreateProjectInput,
  Project,
  ProjectWithCounts,
  UpdateProjectInput,
} from "@devcenter/shared";
import { api } from "./api.js";

export const projectsApi = {
  async list(): Promise<ProjectWithCounts[]> {
    const { data } = await api.get<ProjectWithCounts[]>("/projects");
    return data;
  },
  async create(input: CreateProjectInput): Promise<Project> {
    const { data } = await api.post<Project>("/projects", input);
    return data;
  },
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const { data } = await api.patch<Project>(`/projects/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
