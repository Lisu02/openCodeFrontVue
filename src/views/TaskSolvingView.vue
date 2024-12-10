<script setup>
import { defineProps } from "vue";

defineProps({
  taskId: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h1>Solving task on xxxID: {{ taskId }}</h1>
</template>
