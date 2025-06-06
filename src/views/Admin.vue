<template>
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-6 select-none">
		<div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
			<div class="flex justify-between items-center mb-8">
				<!-- Titolo -->
				<h2 class="text-3xl font-bold">Gestione clienti</h2>
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
						@click="addNewCustomer"
						class="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition flex items-center"
					>
						<svg
							class="w-5 h-5 text-white mr-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								fill-rule="evenodd"
								d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm3 8a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-1 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3 1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1Z"
								clip-rule="evenodd"
							/>
						</svg>
						Nuovo cliente
					</button>
				</div>
			</div>

			<!-- Tabella -->
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<!-- Riga iniziale con i valori della tabella -->
						<tr class="bg-gray-50 text-gray-600 font-medium">
							<th
								v-for="(col, idx) in header"
								:key="idx"
								class="p-4"
								:class="{
									'rounded-tl-xl text-left': idx === 0,
									'rounded-tr-xl text-center': idx === header.length - 1,
									'text-center': idx > 1 || header.length === 1,
									'text-left': idx === 1 && header.length > 1,
								}"
							>
								{{ col }}
							</th>
							<th class="p-4 rounded-tr-xl text-center"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(customer, index) in customers"
							:key="index"
							class="border-b border-gray-200 hover:bg-gray-50 transition select-text"
						>
							<td
								v-for="(col, colIndex) in header"
								:key="colIndex"
								class="p-4"
								:class="{
									'font-medium text-gray-900': colIndex === 0,
									'text-gray-600': colIndex === 1 && header.length > 1,
									'text-gray-500 text-center': colIndex > 1 || header.length === 1,
									'text-center': colIndex > 1 || header.length === 1,
								}"
							>
								<!-- Badge blu se solo numero -->
								<span
									v-if="typeof customer[col] === 'string' && customer[col].trim().match(/^\d+$/)"
									class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap"
								>
									{{ customer[col] }}
								</span>
								<span v-else>
									{{ customer[col] ?? "" }}
								</span>
							</td>
							<td class="p-4">
								<div class="flex justify-center">
									<!-- Pulsante per rimuovere il cliente -->
									<button
										@click="askRemoveCustomer(index)"
										class="text-red-500 hover:text-red-700 hover:cursor-pointer transition p-1"
										title="Rimuovi cliente"
									>
										<svg
											class="w-5 h-5"
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
												d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
											/>
										</svg>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Modal per nuovo cliente -->
			<div
				v-if="showModal"
				class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
			>
				<div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
					<div class="space-y-4">
						<div>
							<label class="block text-gray-700 mb-1">Nome e cognome</label>
							<input
								v-model="newCustomer.name"
								type="text"
								class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
							/>
						</div>
						<div>
							<label class="block text-gray-700 mb-1">Email</label>
							<input
								v-model="newCustomer.email"
								type="email"
								class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
							/>
						</div>
						<div>
							<label class="block text-gray-700 mb-1">Azienda</label>
							<input
								v-model="newCustomer.company"
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
							@click="confirmAddCustomer"
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

// Leggi header e dati dal localStorage
const header = ref(JSON.parse(localStorage.getItem("clienti_header") || "[]"));
const customers = ref(JSON.parse(localStorage.getItem("clienti") || "[]"));

// Gestisce la visibilità del pop-up per aggiungere un nuovo cliente
const showModal = ref(false);

// Gestisce la visibilità del pop-up di conferma rimozione
const showConfirmDelete = ref(false);
const customerToDelete = ref(null);

// Inizializza il nuovo cliente con valori predefiniti
const newCustomer = ref({
	name: "",
	email: "",
	company: "",
	template: "0",
	lastAccess: new Date().toLocaleDateString(),
});

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

// Funzione per esportare i dati in CSV
function exportCSV() {
	const header = ["Nome e cognome", "Email", "Azienda", "Template", "Ultimo accesso"];
	const rows = customers.value.map((c) => [c.name, c.email, c.company, c.template, c.lastAccess]);
	const csvContent = [header, ...rows]
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
