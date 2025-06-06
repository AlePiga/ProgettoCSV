import express from "express";
import clienti from "./clienti.json" assert { type: "json" };

const app = express();
const port = 3000;

app.get("/users", (req, res) => {
	res.send(clienti);
});

app.get("/users/:id", (req, res) => {
	const userId = req.params.id;
	const user = clienti.find((u) => u.id === userId);

	if (user) {
		res.send(user);
	} else {
		res.status(404).send({ error: "Utente non trovato" });
	}
});

app.listen(port, () => {
	console.log(`Express in ascolto su http://localhost:${port}`);
});

/* import { execSync } from "child_process";
import { existsSync } from "fs";

if (!existsSync("node_modules") || !existsSync("node_modules/vite")) {
	console.log("Dipendenze mancanti. Eseguo: npm install");
	execSync("npm install", { stdio: "inherit" });
}

console.log("Avvio dev server con Vite...");
execSync("npm run dev", { stdio: "inherit" });
 */
