import { createRouter, createWebHistory } from "vue-router";
import AppShell from "@/layouts/AppShell.vue";
import { useAuthStore } from "@/stores/auth.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { public: true },
    },
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
          component: () => import("../views/TasksView.vue"),
          meta: { navKey: "tasks" },
        },
        {
          path: "notes",
          name: "notes",
          component: () => import("../views/NotesView.vue"),
          meta: { navKey: "notes" },
        },
        {
          path: "projects",
          name: "projects",
          component: () => import("../views/ProjectsView.vue"),
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
          component: () => import("../views/DevToolsView.vue"),
          meta: { navKey: "devtools" },
        },
        {
          path: "devtools/uuid",
          name: "devtools-uuid",
          component: () => import("../views/devtools/UuidGeneratorView.vue"),
          meta: { navKey: "devtools" },
        },
        {
          path: "favorites",
          name: "favorites",
          component: () => import("../views/FavoritesView.vue"),
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

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.status === "idle") {
    await auth.fetchMe();
  }

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.name === "login" && auth.isAuthenticated) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
