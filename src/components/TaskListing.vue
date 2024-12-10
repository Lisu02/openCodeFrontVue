<script setup>
import api from "@/services/axios";
import { reactive, onMounted } from "vue";

const taskState = reactive({
  task: {},
  isLoading: true,
});

const testFunction = () => {
  console.log("brr");
};
//DZIAŁA ALE ZŁY ENDPOINT GET bo bierze całą liste zamiast jednego zadania
//poprawione bierze wybrany endpoint o ile istnieje
onMounted(async () => {
  try {
    const response = await api.get(`/v1/task/1`);
    taskState.task = response.data;
    console.log(taskState.task);
  } catch (error) {
    console.error(error);
  } finally {
    taskState.isLoading = false;
  }
});
</script>

<template>
  <body>
    <div class="task-container">
      <h2>Task id: {{ taskState.task.id }}</h2>
      <h3>Task function name: {{ taskState.task.functionName }}</h3>
      <p>Return type: {{ taskState.task.returnType }}</p>
    </div>
  </body>
</template>

<style scoped>
body {
  display: flex;
  align-items: center;
}

.task-container {
  background-color: aqua;
  font-family: sans-serif;
  text-align: center;
  width: 50%;
}
</style>
