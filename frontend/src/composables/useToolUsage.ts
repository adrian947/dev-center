import { computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { ToolId } from "@devcenter/shared";
import { toolsApi } from "@/services/tools.js";

export const TOOL_FAVORITES_KEY = ["tools", "favorites"];
export const TOOL_RECENT_KEY = ["tools", "recent"];

export function useToolUsage() {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: TOOL_FAVORITES_KEY,
    queryFn: toolsApi.listFavorites,
  });

  const recentQuery = useQuery({
    queryKey: TOOL_RECENT_KEY,
    queryFn: toolsApi.listRecent,
  });

  const favorites = computed(() => favoritesQuery.data.value ?? []);
  const recents = computed(() => recentQuery.data.value ?? []);

  const favoriteMutation = useMutation({
    mutationFn: ({ toolId, favorite }: { toolId: ToolId; favorite: boolean }) =>
      favorite ? toolsApi.addFavorite(toolId) : toolsApi.removeFavorite(toolId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TOOL_FAVORITES_KEY }),
  });

  const trackMutation = useMutation({
    mutationFn: (toolId: ToolId) => toolsApi.trackRecent(toolId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: TOOL_RECENT_KEY }),
  });

  function isFavorite(toolId: ToolId): boolean {
    return favorites.value.includes(toolId);
  }

  function toggleFavorite(toolId: ToolId): void {
    favoriteMutation.mutate({ toolId, favorite: !isFavorite(toolId) });
  }

  // Un fallo de red al registrar el uso nunca debe romper la herramienta.
  function trackUse(toolId: ToolId): void {
    trackMutation.mutate(toolId, { onError: () => undefined });
  }

  return {
    favorites,
    recents,
    isFavorite,
    toggleFavorite,
    trackUse,
    isLoadingFavorites: favoritesQuery.isLoading,
    isLoadingRecents: recentQuery.isLoading,
  };
}
