<script setup>
import { defineProps } from "vue";
import SolveComp from "@/components/SolveComp.vue";

defineProps({
  taskId: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <h1>Solving task on ID: {{ taskId }}</h1>
  <SolveComp v-bind:task-id="taskId" />
</template>

<style lang="css" scoped>
h1 {
  text-align: center;
}
</style>
