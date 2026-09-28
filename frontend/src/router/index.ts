import { createRouter, createWebHistory } from "vue-router";
import AppShell from "@/layouts/AppShell.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppShell,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/DashboardView.vue"),
          meta: { navKey: "dashboard" },
        },
        {
          path: "tasks",
          name: "tasks",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "tasks" },
        },
        {
          path: "notes",
          name: "notes",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "notes" },
        },
        {
          path: "projects",
          name: "projects",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "projects" },
        },
        {
          path: "links",
          name: "links",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "links" },
        },
        {
          path: "devtools",
          name: "devtools",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "devtools" },
        },
        {
          path: "favorites",
          name: "favorites",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "favorites" },
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../views/ComingSoonView.vue"),
          meta: { navKey: "settings" },
        },
      ],
    },
  ],
});

export default router;
