<script setup>
import { ref } from "vue";
import api from "@/services/axios";
import { toRefs } from "vue";

const resultFromBackend = ref({ description: "no desc" });

const props = defineProps({
  taskId: {
    type: String,
    default: "-1",
  },
});

const {taskId} = toRefs(props);

async function getDescription() {
  try {
    const response = await api.get(`/v1/task/description/${taskId.value}`);
    if(response.status === 200){
      resultFromBackend.value = response.data.description;
    }else {
      resultFromBackend.value = "Error while fetching task description (try) TaskDesc.vue";
    }
  } catch (error) {
    console.error("Error fetching task description", error);
    resultFromBackend.value = "Error fetching task description";
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
