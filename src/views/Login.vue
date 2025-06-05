<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-3">Login</h2>

      <form @submit.prevent="handleLogin">
        <!-- Email Input -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
            placeholder="example@email.com"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-8">
          <label class="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            class="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
            placeholder=""
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition font-bold"
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          Accedi
        </button>
      </form>

      <!-- Registration Link -->
      <p class="text-center text-gray-500 mt-6 text-sm">
        Non hai un account?
        <a href="#" class="text-blue-500 hover:underline font-medium"
          >Registrati</a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const isFormValid = computed(() => email.value && password.value);

const handleLogin = () => {
  if (!isFormValid.value) return;

  console.log("Email:", email.value);
  console.log("Password:", password.value);
  router.push("/dashboard");
};
</script>

<style scoped>
/* Stili aggiuntivi se necessari */
</style>
