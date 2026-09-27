import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";

import App from "./App.vue";
import router from "./router/index.js";
import { i18n } from "./i18n.js";
import { useThemeStore } from "./stores/theme.js";
import "./style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: "[data-theme='dark']" },
  },
});

useThemeStore().init();

app.mount("#app");
