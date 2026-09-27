import { defineStore } from "pinia";

export type Theme = "light" | "dark";

const STORAGE_KEY = "devcenter:theme";

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme: "light" as Theme,
  }),
  actions: {
    init() {
      this.setTheme(getPreferredTheme());
    },
    setTheme(theme: Theme) {
      this.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    },
    toggle() {
      this.setTheme(this.theme === "light" ? "dark" : "light");
    },
  },
});
