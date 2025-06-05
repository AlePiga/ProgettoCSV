<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center">Dashboard</h2>

      <form @submit.prevent="handleSubmit">
        <!-- File input -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Carica file</label>

          <!-- Drop area -->
          <label
            for="file-upload"
            class="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-4 py-12 text-center cursor-pointer transition"
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

          <input
            id="file-upload"
            type="file"
            accept=".csv,.cls,.xlsx"
            @change="handleFileChange"
            class="hidden"
            required
          />
        </div>

        <!-- Select tipo file -->
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

const isFormValid = computed(() => selectedFile.value && fileType.value);

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
  }
};

const handleSubmit = () => {
  if (!isFormValid.value) return;

  alert(
    `File "${selectedFile.value.name}" di tipo "${fileType.value}" inviato!`
  );
  router.push("/GestioneClienti");
};

const resetForm = () => {
  if (confirm("Sei sicuro di voler resettare il form?")) {
    selectedFile.value = null;
    fileType.value = "";
    document.getElementById("file-upload").value = "";
  }
};
</script>
