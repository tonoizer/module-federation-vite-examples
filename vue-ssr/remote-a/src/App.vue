<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import RemoteCard from "./components/RemoteCard.vue";

const RemoteB = defineAsyncComponent(() => import("remote_b/remote-app"));
</script>

<template>
  <RemoteCard title="I'm the remote app">
    <div style="margin-top: 16px; display: flex; justify-content: center">
      <Suspense>
        <RemoteB />
      </Suspense>
    </div>
  </RemoteCard>
</template>
