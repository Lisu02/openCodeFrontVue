<template>
  <div class="auth-page">
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'login' }"
        @click="activeTab = 'login'"
      >
        Logowanie
      </button>
      <button
        :class="{ active: activeTab === 'register' }"
        @click="activeTab = 'register'"
      >
        Rejestracja
      </button>
    </div>
    <div class="form-wrapper">
      <LoginForm v-if="activeTab === 'login'" />
      <RegisterForm v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

const activeTab = ref("login"); // Domyślnie aktywna zakładka to logowanie
</script>

<style scoped>
.auth-page {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: 1px solid #007a52;
  border-radius: 4px;
  background-color: white;
  color: #007a52;
  cursor: pointer;
}

button.active {
  background-color: #007a52;
  color: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}
</style>
