import type { CreateTaskInput, Task, UpdateTaskInput } from "@devcenter/shared";
import { api } from "./api.js";

export const tasksApi = {
  async list(): Promise<Task[]> {
    const { data } = await api.get<Task[]>("/tasks");
    return data;
  },
  async create(input: CreateTaskInput): Promise<Task> {
    const { data } = await api.post<Task>("/tasks", input);
    return data;
  },
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
