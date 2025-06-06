import { execSync } from "child_process";
import { existsSync } from "fs";

// Se la cartella node_modules o vite non esiste, installa le dipendenze
if (!existsSync("node_modules") || !existsSync("node_modules/vite")) {
	console.log("📦 Dipendenze mancanti. Eseguo: npm install");
	execSync("npm install", { stdio: "inherit" });
}

console.log("🚀 Avvio dev server con Vite...");
execSync("npm run dev", { stdio: "inherit" });
