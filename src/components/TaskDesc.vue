<script setup>
import { ref } from "vue";
import api from "@/services/axios";
const resultFromBackend = ref({});

async function getDescription() {
  try {
    const response = await api.get("/task/description");
    resultFromBackend.value = response.data;
  } catch (error) {
    console.error("Error fetching task description", error);
    resultFromBackend = {
      description: "Error fetching task description",
    };
  }
}

getDescription();
</script>

<template>
  <div>
    <textarea readonly v-model="resultFromBackend"></textarea>
  </div>
</template>

<style lang="css" scoped>
textarea {
  color: #ccc;
  width: 99%;
  height: 90%;
  background-color: #282d35;
  font-family: sans-serif;
  font-size: 18px;
  resize: none;
  border: none;
}
</style>
