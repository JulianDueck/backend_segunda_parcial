<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode } from '@primevue/core/api';

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

const reservas = ref([]);
fetch(`${baseUrl}/api/reserva`)
  .then((response) => response.json())
  .then((data) => {
    const res = data.sort((a: any, b: any) => {
    if (a.hora_inicio === b.hora_inicio) {
        return a.id_mesa - b.id_mesa;
      }
      return a.hora_inicio.localeCompare(b.hora_inicio);
    })
    reservas.value = res;
  });

const filters = ref({
  id_restaurante: { value: null, matchMode: FilterMatchMode.EQUALS },
  fecha: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id_cliente: { value: null, matchMode: FilterMatchMode.EQUALS }
});

</script>

<template>
  <main>
    <h1 class="font-bold text-3xl text-center mt-4">Lista de Reservas</h1>
    <div class="flex w-full">
      <DataTable class="flex-1 mx-36" :value="reservas" v-model:filters="filters" filterDisplay="menu">
        <Column field="id" header="ID"></Column>
        <Column sortable field="id_cliente" header="Cliente">
          <template #body="{ data }">
            {{ data.id_cliente }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Filtrar por cliente" />
          </template>
        </Column>
        <Column field="id_restaurante" header="Restaurante" :showFilterMatchModes="false" >
          <template #body="{ data }">
            {{ data.id_restaurante }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Filtrar por restaurante" />
          </template>
        </Column>
        <Column header="Horario">
          <template #body="slotProps">
            <span>{{ slotProps.data.hora_inicio }} a {{ slotProps.data.hora_fin }}</span>
          </template>
        </Column>
        <Column sortable field="id_mesa" header="Mesa"></Column>
        <Column field="fecha" header="Fecha" :showFilterMatchModes="false">
          <template #body="{ data }">
            {{ data.fecha }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Filtrar por fecha" />
          </template>
        </Column>
      </DataTable>
      
    </div>
  </main>
</template>
  
  