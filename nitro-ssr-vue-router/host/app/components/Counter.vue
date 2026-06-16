<script setup lang="ts">
import { onMounted, ref } from "vue";

const count = ref(0);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <button v-if="mounted" class="counter" @click="count++">Host counter: {{ count }}</button>
</template>

<style scoped>
.counter {
  background-color: rgb(246, 179, 82);
  border: 0 solid #e2e8f0;
  border-radius: 4px;
  color: rgb(24, 24, 24);
  cursor: pointer;
  font-weight: 700;
  margin-top: 10px;
  padding: 8px 16px;
}
</style>
