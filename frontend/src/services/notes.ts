import type { CreateNoteInput, Note, UpdateNoteInput } from "@devcenter/shared";
import { api } from "./api.js";

export const notesApi = {
  async list(): Promise<Note[]> {
    const { data } = await api.get<Note[]>("/notes");
    return data;
  },
  async create(input: CreateNoteInput): Promise<Note> {
    const { data } = await api.post<Note>("/notes", input);
    return data;
  },
  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const { data } = await api.patch<Note>(`/notes/${id}`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
