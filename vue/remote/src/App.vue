<script setup lang="ts">
import { state } from "shared";
import Counter from "./components/Counter.vue";
import image from "./remote_assets/logo.svg";
import { formatPrice } from "@/utils/format";
console.log("remote got message:", state.message);
</script>

<template>
  <div
    style="
      background: #1f2124;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      border-radius: 5px;
      margin: 20px 20px 20px 20px;
      width: 250px;
      padding: 20px;
      text-align: center;
      color: white;
      float: left;
    "
    data-e2e="APP__CARD"
  >
    <div class="icon">
      <img width="100" height="100" :src="image" alt="" />
    </div>
    <div style="margin-top: 10px; font-size: 25px">I'm the remote app</div>
    <p>Price: {{ formatPrice(54321, "USD") }}</p>
    <Counter />
  </div>
</template>

<style scoped />
