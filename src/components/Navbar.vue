<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/playground" class="navbar-brand">Open Code</router-link>
    </div>
    <div class="navbar-right">
      <template v-if="!isLoggedIn">
        <!-- <router-link to="/auth" class="nav-button">Zarejestruj się</router-link> -->
        <router-link to="/auth" class="nav-button">Zaloguj się</router-link>
      </template>
      <template v-else>
        <router-link to="/chooseTask" class="nav-button"
          >Choose Task to Solve</router-link
        >
        <router-link to="/add-task" class="nav-button">Add Task</router-link>
        <router-link to="/profile" class="nav-button">Profile</router-link>
        <button class="nav-button" @click="logout">Logout</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import isLoggedIn from "@/services/logged";
// Tymczasowa zmienna do zarządzania stanem logowania
const router = useRouter();

if (localStorage.getItem("jwtToken") !== null) {
  //bandaid solution for logout
  isLoggedIn.value = true;
}

const logout = () => {
  console.log("Wylogowano użytkownika.");
  localStorage.removeItem("jwtToken");
  isLoggedIn.value = false; // Przywracanie stanu po wylogowaniu
  router.push("/auth");
};
</script>

<style scoped>
.navbar {
  font-family: sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #00a06b;
  color: white;
}

.navbar-brand {
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.navbar-right {
  display: flex;
  gap: 10px;
}

.nav-button {
  padding: 8px 12px;
  border: none;
  background-color: white;
  color: #00ca87;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.nav-button:hover {
  background-color: #006342;
  color: white;
  transition: background-color 0.4s ease;
}
</style>
