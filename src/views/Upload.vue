<template>
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-6 select-none">
		<div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
			<h2 class="text-3xl font-bold text-center mb-4">Carica database</h2>

			<form @submit.prevent="handleSubmit">
				<div class="mb-4">
					<!-- Area di drop -->
					<!-- TODO: py-6 dell'area di drop deve venire modificato a 12 (oppure 13?) dopo la fase di test -->
					<label
						for="file-upload"
						class="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition"
						:class="{
							'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500':
								!selectedFile,
							'border-green-400 text-green-600': selectedFile,
						}"
						@dragover.prevent
						@drop.prevent="handleDrop"
					>
						<!-- Icona caricamento file -->
						<svg
							class="w-10 h-10 mb-3"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<span class="text-sm font-medium">
							{{
								selectedFile
									? `${selectedFile.name} caricato con successo!`
									: "Trascina un file qui o fai clic per caricarlo"
							}}
						</span>
					</label>

					<!-- Input file  -->
					<input
						id="file-upload"
						type="file"
						accept=".csv,.cls,.xlsx"
						@change="handleFileChange"
						class="hidden"
					/>
				</div>

				<!-- Select tipo di file -->
				<div class="mb-4">
					<label class="block text-gray-700 mb-1">Tipo di file</label>
					<select
						v-model="fileType"
						class="w-full border-gray-300 border-2 rounded-xl px-4 py-2"
					>
						<option disabled value="">Seleziona tipo</option>
						<option value="csv">CSV</option>
						<option value="cls">CLS</option>
						<option value="xlsx">XLSX</option>
					</select>
				</div>

				<!-- Select tipo di file -->
				<div class="mb-4">
					<label class="block text-gray-700 mb-1">Permesso</label>
					<select
						v-model="loginType"
						class="w-full border-gray-300 border-2 rounded-xl px-4 py-2"
					>
						<option disabled value="">Seleziona permesso</option>
						<option value="User">User</option>
						<option value="Admin">Admin</option>
					</select>
				</div>

				<!-- Select presenza intestazione -->
				<div class="mb-4">
					<label class="block text-gray-700 mb-1">
						La prima riga del file è un'intestazione?
					</label>
					<select
						v-model="hasHeader"
						class="w-full border-gray-300 border-2 rounded-xl px-4 py-2 mb-2"
					>
						<option value="yes">Sì</option>
						<option value="no">No</option>
					</select>
				</div>

				<!-- Bottoni -->
				<div class="flex justify-end">
					<button
						type="button"
						@click="resetForm"
						class="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
					>
						Azzera
					</button>
					<button
						type="submit"
						class="bg-blue-500 text-white px-16 py-2 rounded-xl hover:bg-blue-600 ml-2 transition"
						:disabled="!isFormValid"
						:class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
					>
						Invia
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedFile = ref(null);
const fileType = ref("");
const loginType = ref("");
const hasHeader = ref("yes"); // nuovo stato per l'intestazione

const isFormValid = computed(() => selectedFile.value && fileType.value); // puoi aggiungere anche hasHeader se vuoi obbligatorio

const handleFileChange = (event) => {
	// Prende il primo file caricato manualmente da un <input type="file"> e lo salva in selectedFile
	selectedFile.value = event.target.files[0];
	console.log(`Caricato: ${selectedFile.value.name}`);
};

const handleDrop = (event) => {
	// Permette di trascinare un file nell’interfaccia.
	// Impedisce il comportamento predefinito del browser e salva il file come selectedFile
	event.preventDefault();
	const files = event.dataTransfer.files;
	if (files.length > 0) {
		selectedFile.value = files[0];
	}
	console.log(`Trascinato: ${selectedFile.value.name}`);
};

const handleSubmit = () => {
	if (!isFormValid.value) return;

	if (fileType.value === "csv" || fileType.value === "cls" || fileType.value === "xlsx") {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target.result;
			const rows = text.split(/\r?\n/).filter(Boolean);
			let header, dataRows, data;
			if (hasHeader.value === "yes") {
				header = rows[0].split(",");
				dataRows = rows.slice(1);
				data = dataRows.map((row) => {
					const values = row.split(",");
					const obj = {};
					header.forEach((h, i) => {
						obj[h] = values[i]?.replace(/"/g, "") ?? "";
					});
					return obj;
				});
			} else {
				const numCols = rows[0].split(",").length;
				header = Array.from({ length: numCols }, (_, i) => i.toString());
				data = rows.map((row) => {
					const values = row.split(",");
					const obj = {};
					header.forEach((h, i) => {
						obj[h] = values[i]?.replace(/"/g, "") ?? "";
					});
					return obj;
				});
			}
			localStorage.setItem("clienti", JSON.stringify(data));
			localStorage.setItem("clienti_header", JSON.stringify(header));
			if (loginType.value == "User") {
				router.push("/anteprima");
			} else if (loginType.value == "Admin") {
				router.push("/admin");
			}
		};
		reader.readAsText(selectedFile.value);
	} else {
		console.log(`Caricato: ${selectedFile.value.name}, di tipo ${fileType.value}`);
		router.push("/admin");
	}
};

const resetForm = () => {
	// Azzzera tutti i campi del form
	selectedFile.value = null;
	fileType.value = "";
	document.getElementById("file-upload").value = "";
};
</script>
