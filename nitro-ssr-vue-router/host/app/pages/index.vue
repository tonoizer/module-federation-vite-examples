<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import HostCard from "../components/HostCard.vue";
import HostSsrComponent from "../components/HostSsrComponent.vue";

const RemoteWidget = defineAsyncComponent({
  loader: () => import("remote/Widget").then((m) => m.default || m),
  suspensible: true,
});

const RemoteCounter = defineAsyncComponent({
  loader: () => import("remote/Counter").then((m) => m.default || m),
  suspensible: true,
});
</script>

<template>
  <main class="examples">
    <div class="host-column">
      <HostCard />
    </div>
    <div class="component-grid">
      <HostSsrComponent />
      <Suspense>
        <RemoteWidget />
        <template #fallback>
          <div>Loading remote widget...</div>
        </template>
      </Suspense>
      <Suspense>
        <RemoteCounter />
        <template #fallback>
          <div>Loading remote counter...</div>
        </template>
      </Suspense>
    </div>
  </main>
</template>
