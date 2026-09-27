import { createI18n } from "vue-i18n";
import es from "./locales/es.js";
import en from "./locales/en.js";

export type SupportedLocale = "es" | "en";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["es", "en"];

export const i18n = createI18n({
  legacy: false,
  locale: "es",
  fallbackLocale: "es",
  messages: { es, en },
});
