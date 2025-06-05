<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold">Gestione clienti</h2>
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

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 text-left text-gray-600 font-medium">
              <th class="p-4 rounded-tl-xl text-left">Nome e cognome</th>
              <th class="p-4 text-left">Email</th>
              <th class="p-4 text-left">Azienda</th>
              <th class="p-4 text-center">Template</th>
              <th class="p-4 text-center">Ultimo accesso</th>
              <th class="p-4 rounded-tr-xl text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(customer, index) in customers"
              :key="index"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="p-4 font-medium text-gray-900">{{ customer.name }}</td>
              <td class="p-4 text-gray-600">{{ customer.email }}</td>
              <td class="p-4 text-gray-600">{{ customer.company }}</td>
              <td class="p-4">
                <div class="flex justify-center">
                  <span
                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                  >
                    {{ customer.template }}
                  </span>
                </div>
              </td>
              <td class="p-4 text-gray-500 text-center">
                {{ customer.lastAccess }}
              </td>
              <td class="p-4">
                <div class="flex justify-center">
                  <button
                    @click="removeCustomer(index)"
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
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
          <h3 class="text-2xl font-bold mb-4">Aggiungi Nuovo Cliente</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-1">Nome e Cognome</label>
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
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Annulla
            </button>
            <button
              @click="confirmAddCustomer"
              class="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Dati statici dei clienti
const customers = ref([
  {
    name: "Adrian Townsend",
    email: "kohihu@neezaona.lt",
    company: "Alpha corp.",
    template: "T-001",
    lastAccess: "15/06/2023",
  },
  {
    name: "Ryan Hale",
    email: "baskawij@wig.ck",
    company: "Beta corp.",
    template: "T-005",
    lastAccess: "10/06/2023",
  },
  {
    name: "Earl Garrett",
    email: "am@esimofvu.cl",
    company: "Gamma corp.",
    template: "T-003",
    lastAccess: "05/06/2023",
  },
  {
    name: "Eula Rivera",
    email: "paoj@foromu.mp",
    company: "Kappa corp.",
    template: "T-002",
    lastAccess: "01/06/2023",
  },
]);

const showModal = ref(false);
const newCustomer = ref({
  name: "",
  email: "",
  company: "",
  template: "T-00" + (customers.value.length + 1),
  lastAccess: new Date().toLocaleDateString(),
});

const addNewCustomer = () => {
  newCustomer.value = {
    name: "",
    email: "",
    company: "",
    template: "T-00" + (customers.value.length + 1),
    lastAccess: new Date().toLocaleDateString(),
  };
  showModal.value = true;
};

const confirmAddCustomer = () => {
  if (newCustomer.value.name && newCustomer.value.email) {
    customers.value.unshift({ ...newCustomer.value });
    showModal.value = false;
  }
};

const removeCustomer = (index) => {
  if (confirm("Sei sicuro di voler rimuovere questo cliente?")) {
    customers.value.splice(index, 1);
  }
};
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
