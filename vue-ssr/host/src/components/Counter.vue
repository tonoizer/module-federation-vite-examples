<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <button
    type="button"
    style="
      border: 0 solid #e2e8f0;
      margin-top: 10px;
      background-color: rgb(246, 179, 82);
      border-radius: 0.25rem;
      font-weight: 700;
      padding: 0.5rem 1rem;
      color: rgb(24, 24, 24);
      cursor: pointer;
    "
    @click="count++"
  >
    Host counter: {{ count }}
  </button>
</template>
