import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Tabella from "../views/GestioneClienti.vue";
import GestioneClienti from "../views/GestioneClienti.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/GestioneClienti",
    name: "GestioneClienti",
    component: GestioneClienti,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
