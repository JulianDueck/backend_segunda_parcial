<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main class="h-screen flex-col">
    <header>
      <div class="bg-[#10b981] h-20">
        <div class="flex h-full items-center">
          <RouterLink to="/" class="text-white px-5 py-3 rounded-lg ">Reservas</RouterLink>
          <RouterLink to="/mesas" class="text-white px-5 py-3 rounded-lg ">Mesas</RouterLink>
          <RouterLink to="/reservas" class="text-white px-5 py-3 rounded-lg ">Lista de Reservas</RouterLink>
        </div>
      </div>
    </header>
    
    <RouterView />
  </main>
</template>

