<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main class="h-screen flex-col">
    <header>
      <div class="bg-[#10b981] h-20">
        <div class="flex justify-around h-full items-center">
          <RouterLink to="/" class="bg-white px-5 py-3 rounded-lg border border-black">Reservas</RouterLink>
          <RouterLink to="/reservas" class="bg-white px-5 py-3 rounded-lg border border-black">Lista de Reservas</RouterLink>
        </div>
      </div>
    </header>
    
    <RouterView />
  </main>
</template>

