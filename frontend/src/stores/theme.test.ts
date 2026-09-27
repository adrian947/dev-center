import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "./theme.js";

describe("theme store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("toggles between light and dark", () => {
    const store = useThemeStore();
    store.setTheme("light");

    store.toggle();
    expect(store.theme).toBe("dark");

    store.toggle();
    expect(store.theme).toBe("light");
  });

  it("persists the theme to localStorage", () => {
    const store = useThemeStore();
    store.setTheme("dark");

    expect(localStorage.getItem("devcenter:theme")).toBe("dark");
  });
});
