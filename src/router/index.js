import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Upload from "@/views/Upload.vue";
import PannelloAdmin from "../views/Admin.vue";
import Anteprima from "../views/Anteprima.vue";

const routes = [
	// Pagine del sito gestite dal router
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/upload",
		name: "Upload",
		component: Upload,
	},
	{
		path: "/admin",
		name: "Admin",
		component: PannelloAdmin,
	},
	{
		path: "/anteprima",
		name: "Anteprima",
		component: Anteprima,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
