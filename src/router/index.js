import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
// import Tabella from "../views/GestioneClienti.vue";
import GestioneClienti from "../views/GestioneClienti.vue";

const routes = [
	// Pagine del sito gestite dal router
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
		path: "/gestione-clienti",
		name: "GestioneClienti",
		component: GestioneClienti,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
