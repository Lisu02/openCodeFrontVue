<template>
  <div class="form-container">
    <h2>Rejestracja</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="passwordRepeat">Repeat Password</label>
        <input
          v-model="passwordRepeat"
          type="password"
          id="passwordRepeat"
          required
        />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit">Zarejestruj się</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/axios";

const username = ref("");
const password = ref("");
const passwordRepeat = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = ""; // Resetuj komunikat o błędzie
  if (password.value !== passwordRepeat.value) {
    errorMessage.value = "Hasła nie są identyczne.";
    return;
  }

  const newUserData = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await api.post(`/register`, newUserData);
    if (response.status === 200) {
      console.log("Rejestracja zakończona sukcesem:", response.data);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Konflikt - użytkownik już istnieje
      errorMessage.value = "Użytkownik o podanej nazwie już istnieje.";
    } else {
      // Inny błąd
      errorMessage.value =
        "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.";
    }
    console.error(error);
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
  font-size: 14px;
  margin-bottom: 15px;
}
</style>
