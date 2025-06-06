<template>
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-6 select-none">
		<div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
			<div class="flex justify-between items-center mb-8">
				<!-- Titolo -->
				<h2 class="text-3xl font-bold">Anteprima file</h2>
				<div class="flex gap-3">
					<!-- Bottoni -->
					<button
						@click="exportCSV"
						class="border-2 border-dashed border-green-500 bg-white text-green-500 px-6 py-2 rounded-xl hover:bg-green-100 transition flex items-center"
					>
						<svg
							class="w-5 h-5 text-green-500 mr-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								fill="none"
							/>
						</svg>
						Esporta CSV
					</button>
					<button
						@click="addNewRow"
						class="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition flex items-center"
					>
						<svg
							class="w-6 h-6 text-gray-800 dark:text-white mr-1"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 5v14m-8-7h2m0 0h2m-2 0v2m0-2v-2m12 1h-6m6 4h-6M4 19h16c.5523 0 1-.4477 1-1V6c0-.55228-.4477-1-1-1H4c-.55228 0-1 .44772-1 1v12c0 .5523.44772 1 1 1Z"
							/>
						</svg>
						Nuova riga
					</button>
				</div>
			</div>

			<!-- Tabella -->
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<!-- Riga iniziale con i valori della tabella -->
						<tr class="bg-gray-50 text-gray-600 font-medium">
							<th v-for="(col, idx) in header" :key="idx" class="p-4 text-center">
								{{ col }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, rowIndex) in customers"
							:key="rowIndex"
							class="border-b border-gray-200 hover:bg-gray-50 transition select-text"
						>
							<td
								v-for="(col, colIndex) in header"
								:key="colIndex"
								class="p-4 text-center"
							>
								<!-- Se la cella contiene solo un numero, mostra come badge blu -->
								<span
									v-if="
										typeof row[col] === 'string' &&
										row[col].trim().match(/^\d+$/)
									"
									class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap"
								>
									{{ row[col] }}
								</span>
								<span v-else>
									{{ row[col] ?? "" }}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Modal per nuova riga -->
			<div
				v-if="showModal"
				class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
			>
				<div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
					<div class="space-y-4">
						<div v-for="(col, idx) in header" :key="idx">
							<label class="block text-gray-700 mb-1">{{ col }}</label>
							<input
								v-model="newRow[col]"
								type="text"
								class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
							/>
						</div>
					</div>
					<div class="flex justify-end mt-6 space-x-3">
						<button
							@click="showModal = false"
							class="px-4 py-2 text-gray-600 hover:text-gray-800 transition hover:cursor-pointer"
						>
							Annulla
						</button>
						<button
							@click="confirmAddRow"
							class="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition hover:cursor-pointer"
						>
							Salva
						</button>
					</div>
				</div>
			</div>

			<!-- Modal di conferma rimozione cliente -->
			<div
				v-if="showConfirmDelete"
				class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
			>
				<div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
					<!-- <h3 class="text-lg font-semibold mb-4 text-gray-800">Conferma eliminazione</h3 -->
					<p class="mb-6 text-gray-600">Confermi di voler rimuovere questo cliente?</p>
					<div class="flex justify-end gap-3">
						<button
							@click="cancelRemoveCustomer"
							class="px-4 py-2 text-gray-600 hover:text-gray-800 transition hover:cursor-pointer"
						>
							Annulla
						</button>
						<button
							@click="confirmRemoveCustomer"
							class="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition hover:cursor-pointer"
						>
							Elimina
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";

// Recupera header e dati dal localStorage
const clientiHeader = localStorage.getItem("clienti_header");
const clienti = localStorage.getItem("clienti");

// Determina se l'header è numerico (no intestazione) o testuale (intestazione presente)
let headerArr = [];
let customersArr = [];

if (clientiHeader) {
	headerArr = JSON.parse(clientiHeader);
} else if (clienti && clienti.length > 0) {
	// fallback: genera header numerico in base al numero di colonne della prima riga
	const firstRow = JSON.parse(clienti)[0];
	headerArr = Object.keys(firstRow);
}

if (clienti) {
	customersArr = JSON.parse(clienti);
}

const header = ref(headerArr);
const customers = ref(customersArr);

// Modal gestione nuova riga
const showModal = ref(false);
const newRow = ref({});

// Quando si apre il modal, resetta i valori
const addNewRow = () => {
	newRow.value = {};
	header.value.forEach((col) => {
		newRow.value[col] = "";
	});
	showModal.value = true;
};

// Conferma aggiunta nuova riga
const confirmAddRow = () => {
	// Aggiungi la nuova riga solo se almeno un campo è compilato
	if (Object.values(newRow.value).some((v) => v && v.trim() !== "")) {
		customers.value.unshift({ ...newRow.value });
		showModal.value = false;
	}
};

// Gestisce la visibilità del pop-up di conferma rimozione
const showConfirmDelete = ref(false);
const customerToDelete = ref(null);

// Funzione per aggiungere un nuovo cliente
const addNewCustomer = () => {
	newCustomer.value = {
		name: "",
		email: "",
		company: "",
		template: "0",
		lastAccess: new Date().toLocaleDateString(),
	};
	showModal.value = true;
};

// Se sono presenti nome e email, il cliente viene aggiunto alla lista
const confirmAddCustomer = () => {
	if (newCustomer.value.name && newCustomer.value.email) {
		customers.value.unshift({ ...newCustomer.value });
		showModal.value = false;
	}
};

// Mostra il pop-up di conferma rimozione
const askRemoveCustomer = (index) => {
	customerToDelete.value = index;
	showConfirmDelete.value = true;
};

// Conferma la rimozione del cliente
const confirmRemoveCustomer = () => {
	if (customerToDelete.value !== null) {
		customers.value.splice(customerToDelete.value, 1);
	}
	showConfirmDelete.value = false;
	customerToDelete.value = null;
};

// Annulla la rimozione
const cancelRemoveCustomer = () => {
	showConfirmDelete.value = false;
	customerToDelete.value = null;
};

// Salva i clienti su localStorage ogni volta che cambiano
watch(
	customers,
	(val) => {
		localStorage.setItem("clienti", JSON.stringify(val));
	},
	{ deep: true }
);

// Esporta CSV dinamico
function exportCSV() {
	const rows = customers.value.map((row) => header.value.map((col) => row[col] ?? ""));
	const csvContent = [header.value, ...rows]
		.map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
		.join("\r\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", "clienti.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
</script>

<style scoped>
table {
	min-width: 800px;
}

@media (min-width: 1024px) {
	table {
		min-width: auto;
		width: 100%;
	}
}
</style>
