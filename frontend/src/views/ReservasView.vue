<script setup lang="ts">
import { computed, ref } from "vue";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

const restuaranteURL = ref(`${baseUrl}/api/restaurante`);

const reservas = ref([]);
const error = ref(null);
const loading = ref(false);
fetch(restuaranteURL.value)
  .then((response) => response.json())
  .then((data) => {
    reservas.value = data;
  })
  .catch((err) => {
    error.value = err;
  })
  .finally(() => {
    loading.value = false;
  });

const selectedRestaurante = ref();
const date = ref(new Date());

const selectedHoras = ref([]);
const horas = ref([
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00",
])

const horasMap = ref({
  "12:00 - 13:00": "12:00:00",
  "13:00 - 14:00": "13:00:00",
  "14:00 - 15:00": "14:00:00",
  "19:00 - 20:00": "19:00:00",
  "20:00 - 21:00": "20:00:00",
  "21:00 - 22:00": "21:00:00",
  "22:00 - 23:00": "22:00:00",
})
const cedula = ref("");

const validCedula = computed(() => {
  return cedula.value !== "";
});

const validRestaurante = computed(() => {
  return selectedRestaurante.value !== undefined;
});

const validDate = computed(() => {
  return date.value !== null;
});

const validHoras = computed(() => {
  return selectedHoras.value.length > 0;
});

const formatedDate = computed(() => {
  return date.value.toISOString().split("T")[0];
});

const formatedHoras = computed(() => {
  return selectedHoras.value.map((hora) => horasMap.value[hora]).join(",");
});

const listaRestaurantes = ref([]);
const listaEsNula = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (validRestaurante.value && validDate.value && validHoras.value && validCedula.value) {
    const response = await fetch(`${baseUrl}/api/reserva/${selectedRestaurante.value.id}/${formatedDate.value}/${formatedHoras.value}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      })
    listaRestaurantes.value = response;
    if (response.length === 0) {
      listaEsNula.value = true;
      visible.value = true;
    }
  }else{ 
    console.log("Formulario inválido");    
    visible.value = true;
  }
};
const visible = ref(false);
const noClient = ref(false);
const helperReserva = ref();

const handleReserva = async (reserva: any) => {
  helperReserva.value = reserva;
  await fetch(`${baseUrl}/api/cliente/${cedula.value}`)
    .then((response) => response.json())
    .then((data) => {
      // si el cliente existe
      if(data.find){
        const dataReserva = {
          fecha: date.value.toISOString().split("T")[0],
          hora_inicio: helperReserva.value.hora_inicio,
          hora_fin: helperReserva.value.hora_fin,
          cantidad_solicitada: helperReserva.value.capacidad_mesa,
          id_mesa: helperReserva.value.id_mesa,
          id_cliente: data.cliente.id,
          id_restaurante: selectedRestaurante.value.id,
        }
        fetch(`${baseUrl}/api/reserva`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataReserva),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            alert("Reserva realizada con éxito");

          })
          .catch((err) => {
            console.error(err);
          })
      }else{
        crearUsuario.value = true;
      }
    })
    .catch((err) => {
      console.error(err);
    })
};

const handleCrearUsuario = async () => {
  const dataCliente = {
    nombre: nombre.value,
    apellido: apellido.value,
    cedula: cedula.value,
  }
  fetch(`${baseUrl}/api/cliente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataCliente),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Cliente creado con éxito");
      handleReserva(helperReserva.value);
    })
    .catch((err) => {
      console.error(err);
    }).finally(() => {
      crearUsuario.value = false;
      nombre.value = "";
      apellido.value = "";
    });
};

const crearUsuario = ref(false);
const nombre = ref("");
const apellido = ref("");

</script>

<template>
  <main class="pt-10 w-full content-center">
    <div class="flex-col">
      <div class="flex flex-auto justify-center">
        <Card style="width: 50%; overflow: hidden;">
          <template #header>
            <h1 class="font-bold text-3xl text-center mt-4">Reservas</h1>
          </template>
          <template #content>
            <form @submit="handleSubmit">
              <div class="flex justify-center">
                <Select v-model="selectedRestaurante" :options="reservas" optionLabel="nombre" placeholder="Seleccione un restaurante" class="w-[50%]" />
              </div>
              <div class="flex justify-center mt-4">
                <div class="flex-col w-[50%]">
                  <label for="date" class="font-bold block mb-2">Fecha</label>
                  <DatePicker v-model="date" class="w-full" inputId="date" dateFormat="dd/mm/yy" />
                </div>
              </div>
              <div class="card flex justify-center mt-4">
                <div class="flex-col w-[50%]">
                  <label for="hora" class="font-bold block mb-2">Hora</label>
                  <MultiSelect v-model="selectedHoras" :options="horas" placeholder="Seleccione el horario de la reserva" class="w-full" inputId="hora" />
                </div>
              </div>
              <div class="card flex justify-center mt-4">
                <div class="flex-col w-[50%]">
                  <label for="cedula" class="font-bold block mb-2">Cedula de Identidad</label>
                  <InputText type="text" v-model="cedula" inputId="cedula" class="w-full" />
                </div>
              </div>
              <div class="flex gap-4 mt-4 justify-center">
                <Button type="submit" label="Buscar" class="w-[50%]" />
              </div>
            </form>
          </template>
        </Card>
      </div>
      <div v-if="listaRestaurantes.length > 0" class="flex flex-auto justify-center mt-4">
        <Card style="width: 50%; overflow: hidden">
          <template #header>
            <h1 class="font-bold text-3xl text-center mt-4">Restaurantes Disponibles</h1>
          </template>
          <template #content>
            <DataTable :value="listaRestaurantes" class="w-full">
              <Column field="id_mesa" header="ID"></Column>
              <Column field="nombre_mesa" header="Tipo de mesa"></Column>
              <Column field="capacidad_mesa" header="Capacidad"></Column>
              <Column header="Horario">
                <template #body="slotProps">
                  <span>{{ slotProps.data.hora_inicio }} a {{ slotProps.data.hora_fin }}</span>
                </template>
              </Column>
              <Column header="Accion">
                <template #body="slotProps">
                  <Button label="Reservar" class="p-button-success" @click="handleReserva(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <Dialog v-model:visible="visible" modal header="Error" :style="{ width: '25rem' }">
      <div class="card flex flex-wrap gap-4 m-1 justify-center">
        <Message v-if="!validRestaurante" severity="error">Seleccione un restaurante</Message>
        <Message v-if="!validDate" severity="error">Seleccione una fecha</Message>
        <Message v-if="!validHoras" severity="error">Seleccione una hora</Message>
        <Message v-if="!validCedula" severity="error">Ingrese su cedula de identidad</Message>
        <Message v-if="noClient" severity="error">No existe cliente con esa cedula ingresada</Message>
        <Message v-if="listaEsNula" severity="error">No hay restaurantes disponibles</Message>
      </div>
    </Dialog>

    <Dialog v-model:visible="crearUsuario" modal header="Crear Usuario" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-24">Nombre</label>
        <InputText id="nombre" v-model="nombre" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="apellido" class="font-semibold w-24">Apellido</label>
        <InputText id="apellido" v-model="apellido" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Cedula</label>
        <InputText id="email" v-model="cedula" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="crearUsuario = false"></Button>
        <Button type="button" label="Crear y Reservar" @click="handleCrearUsuario"></Button>
      </div>
    </Dialog>
  </main>
</template>
