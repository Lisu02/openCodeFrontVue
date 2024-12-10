import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PlaygroundView from "@/views/PlaygroundView.vue";
import SolveTasksView from "@/views/SolveTasksView.vue";
import AddTaskView from "@/views/AddTaskView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AuthView from "@/views/AuthView.vue"; // Import nowego widoku
import Preview from "@/views/Preview.vue";
import ChooseTaskView from "@/views/ChooseTaskView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/auth",
    },
    {
      path: "/preview",
      name: "preview",
      component: Preview,
    },
    {
      path: "/playground",
      name: "playground",
      component: PlaygroundView,
      meta: { requiresAuth: true },
    },
    {
      path: "/chooseTask",
      name: "chooseTask",
      component: ChooseTaskView,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-task",
      name: "addTask",
      component: AddTaskView,
      meta: { requiresAuth: true },
    },
    {
      path: "/solve/:taskId",
      name: "solve",
      component: SolveTasksView,
      props: true,
      // meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView, // Nowa trasa dla logowania/rejestracji
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("jwtToken");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
