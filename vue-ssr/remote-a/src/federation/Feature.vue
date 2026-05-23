<script setup lang="ts">
import Pill from "remote_b/Pill";
</script>
<template>
  <section class="federated-block remote-a">
    <h2>remote_a / Feature</h2>
    <p>Nests <code>remote_b/Pill</code> via a direct federated import.</p>
    <Pill label="nested via remote_b" />
  </section>
</template>
