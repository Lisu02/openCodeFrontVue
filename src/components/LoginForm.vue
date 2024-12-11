<template>
  <div class="form-container">
    <h2>Logowanie</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Zaloguj się</button>
    </form>
    <!-- Czerwona informacja o błędzie -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router";
import api from "@/services/axios";
import isLoggedIn from "@/services/logged";

const username = ref("");
const password = ref("");
const token = ref("");
const errorMessage = ref(""); // Dodano stan dla błędu

const handleSubmit = async () => {
  const loginData = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await api.post(`/login`, loginData);
    console.log(response);
    if (response.status === 200) {
      token.value = await response.data;
      localStorage.setItem("jwtToken", token.value);
      isLoggedIn.value = true;
      errorMessage.value = ""; // Wyczyść błąd w przypadku sukcesu
      router.push(`/playground`);
    }
  } catch (e) {
    console.error("Login failed", e);
    errorMessage.value = "Nieprawidłowy login lub hasło"; // Ustaw komunikat o błędzie
  }
};
</script>

<style scoped>
.form-container {
  color: #00bd7e;
  font-family: sans-serif;
  width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #00bd7e;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #007a52;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
