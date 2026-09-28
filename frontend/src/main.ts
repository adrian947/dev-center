import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";

import App from "./App.vue";
import router from "./router/index.js";
import { i18n } from "./i18n.js";
import { useThemeStore } from "./stores/theme.js";
import { missionControlPreset } from "./theme/missionControlPreset.js";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin);
app.use(PrimeVue, {
  theme: {
    preset: missionControlPreset,
    options: { darkModeSelector: "[data-theme='dark']" },
  },
});

useThemeStore().init();

app.mount("#app");
