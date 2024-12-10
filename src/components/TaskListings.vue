<script setup>
import { ref, watch, computed, onMounted } from "vue";
import api from "@/services/axios";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const tasks = ref([]);
const filteredTasks = computed(() =>
  tasks.value.filter(
    (task) =>
      task.functionName
        .toLowerCase()
        .includes(props.searchQuery.toLowerCase()) ||
      task.taskId.toString().includes(props.searchQuery)
  )
);

onMounted(async () => {
  try {
    const response = await api.get(`/v1/taskId`);
    tasks.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="task-list">
    <div v-for="task in filteredTasks" :key="task.taskId" class="task-card">
      <div class="task-details">
        <h2>{{ task.functionName }}</h2>
        <p><strong>Task ID:</strong> {{ task.taskId }}</p>
        <p><strong>Task creator:</strong> {{ task.creatorUsername }}</p>
        <p><strong>Return Type:</strong> {{ task.returnType }}</p>
      </div>
      <RouterLink :to="`/solve/${task.taskId}`" class="solve-button">
        Solve this task
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
}

h2 {
  color: #00bd7e;
  margin: 0;
}

p {
  margin: 5% 0;
  color: #555;
}

.task-list {
  color: black;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.task-card {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  width: calc(33.333% - 10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.solve-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #00bd7e;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.solve-button:hover {
  background-color: #007a52;
}
</style>
