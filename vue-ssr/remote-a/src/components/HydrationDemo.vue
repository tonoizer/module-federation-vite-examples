<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <section class="host-block hydration-demo">
    <div>
      <strong>Client hydration check</strong>
      <p class="lede">
        If this button increments after load, SSR markup hydrated and client JS is active.
      </p>
    </div>
    <button class="demo-button" type="button" @click="count++">Clicks: {{ count }}</button>
  </section>
</template>
