<script setup>
import TaskListings from "@/components/TaskListings.vue";
import { ref } from "vue";

const searchQuery = ref(""); // Przechowywanie wpisanej frazy wyszukiwania
</script>

<template>
  <div class="layout">
    <!-- Wyszukiwarka -->
    <div class="sidebar">
      <h2>Search Tasks</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or ID"
        class="search-input"
      />
    </div>

    <!-- Lista zadań -->
    <div class="main-content">
      <TaskListings :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  width: 100%;
}

.sidebar {
  width: 200px;
  height: 200px;
  padding: 20px;
  background-color: #f5f5f5;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  font-size: 18px;
  color: #333;
}

.search-input {
  width: 94%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
}

.main-content {
  width: 75%;
  padding: 20px;
}
</style>
