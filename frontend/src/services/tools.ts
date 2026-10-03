import type { ToolId } from "@devcenter/shared";
import { api } from "./api.js";

export interface RecentToolEntry {
  toolId: ToolId;
  lastUsedAt: string;
  useCount: number;
}

export const toolsApi = {
  async listFavorites(): Promise<ToolId[]> {
    const { data } = await api.get<ToolId[]>("/tools/favorites");
    return data;
  },
  async addFavorite(toolId: ToolId): Promise<void> {
    await api.put(`/tools/favorites/${toolId}`);
  },
  async removeFavorite(toolId: ToolId): Promise<void> {
    await api.delete(`/tools/favorites/${toolId}`);
  },
  async listRecent(): Promise<RecentToolEntry[]> {
    const { data } = await api.get<RecentToolEntry[]>("/tools/recent");
    return data;
  },
  async trackRecent(toolId: ToolId): Promise<void> {
    await api.post("/tools/recent", { toolId });
  },
};
