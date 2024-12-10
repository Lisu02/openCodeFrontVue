<script setup>
import EditorComp from "./EditorComp.vue";
import TaskDesc from "./TaskDesc.vue";
import { defineProps } from "vue";

defineProps({
  taskId: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <TaskDesc />
    <EditorComp v-bind:is-playground="false" v-bind:task-id="taskId" />
  </div>
</template>
