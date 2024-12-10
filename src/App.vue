<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar class="navbar" />
  <RouterView />
</template>

<style scoped>
* {
  margin: 0;
}

.navbar {
  margin-top: 0;
}
</style>
