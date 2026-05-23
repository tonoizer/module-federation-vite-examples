<script setup lang="ts">
defineProps<{ label: string }>();
</script>
<template>
  <span class="pill">{{ label }}</span>
</template>
