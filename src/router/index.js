import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: () => import("../views/HomeView.vue") },
  { path: "/lessons", component: () => import("../views/LessonsView.vue") },
  { path: "/bio", component: () => import("../views/BioView.vue") },
  { path: "/clinics", component: () => import("../views/ClinicsView.vue") },
  {
    path: "/player-family",
    component: () => import("../views/PlayerFamilyView.vue"),
  },
  {
    path: "/mailing-list",
    component: () => import("../views/MailingListView.vue"),
  },
  { path: "/login", component: () => import("../views/LoginView.vue") },
  {
    path: "/admin",
    component: () => import("../views/AdminView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    return "/login";
  }
});

export default router;
