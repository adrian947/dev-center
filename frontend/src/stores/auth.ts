import { defineStore } from "pinia";
import type { AuthUser } from "@devcenter/shared";
import { api } from "@/services/api.js";

type AuthStatus = "idle" | "loading" | "ready";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    status: "idle" as AuthStatus,
  }),
  getters: {
    isAuthenticated: (state): boolean => state.user !== null,
  },
  actions: {
    async fetchMe(): Promise<void> {
      this.status = "loading";
      try {
        const { data } = await api.get<AuthUser>("/auth/me");
        this.user = data;
      } catch {
        this.user = null;
      } finally {
        this.status = "ready";
      }
    },
    async logout(): Promise<void> {
      await api.post("/auth/logout");
      this.user = null;
    },
    loginWithGoogle(): void {
      window.location.href = "/api/auth/google";
    },
  },
});
