<script setup lang="ts">
import { computed, ref } from "vue";
import selectSearch from '../components/selectSearch.vue'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

const mesaUrl = ref(`${baseUrl}/api/mesa/`);

const mesas = ref([]);
const error = ref(null);
const loading = ref(false);
fetch(mesaUrl.value)
    .then((response) => response.json())
    .then((data) => {
        mesas.value = data;
    })
    .catch((err) => {
        error.value = err;
    })
    .finally(() => {
        loading.value = false;
    });

const selectedMesa = ref();

const validMesa = computed(() => {
    return selectedMesa.value !== undefined;
});

const Mesa = ref([]);
const MesaNula = ref(false);
const Ocupado = ref(false);

const DetallesList = ref([]);
const Cabecera = ref([])

const getDetalles = async () => {
    Cabecera.value = await fetch(`${baseUrl}/api/cabecera/mesa/${selectedMesa.value.id}`, {
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

    return fetch(`${baseUrl}/api/detalle/${Cabecera.value.id}`, {
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
}

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (validMesa.value) {
        const response = await fetch(`${baseUrl}/api/mesa/${selectedMesa.value.id}`, {
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
        Mesa.value = response;

        if (Mesa.value.estado === 'desocupado'){
            Ocupado.value = false;
        }else{
            Ocupado.value = true;
            const detalle = await getDetalles();
            DetallesList.value = detalle.detalles
        }

        if (response.length === 0) {
            MesaNula.value = true;
            visible.value = true;
        }
    }else{ 
        console.log("Formulario inválido");    
        visible.value = true;
    }
};

const handleSelectCliente = async (e: Event) => {
}
const visible = ref(false);
const noClient = ref(false);
const helperReserva = ref();

const crearUsuario = ref(false);
const nombre = ref("");
const apellido = ref("");

const value = ref({ name: "Vue.js", language: "JavaScript" });
const options = ref([
  { name: "Vue.js", language: "JavaScript" },
  { name: "Rails", language: "Ruby" },
  { name: "Sinatra", language: "Ruby" },
  { name: "Laravel", language: "PHP" },
  { name: "Phoenix", language: "Elixir" },
]);

const nameWithLang = ({ name, language }) => `${name} — [${language}]`;

</script>

<template>
    <main class="pt-10 w-full content-center">
        <div class="flex-col">
            <div class="flex flex-auto justify-center">
            <Card style="width: 50%; overflow: hidden;">
                <template #header>
                <h1 class="font-bold text-3xl text-center mt-4">Mesas</h1>
                </template>
                <template #content>
                    <form @submit="handleSubmit">
                        <div class="flex justify-center">
                            <Select v-model="selectedMesa" :options="mesas" optionLabel="nombre" placeholder="Seleccione una mesa" class="w-[50%]" />
                        </div>
                        
                        <div class="flex gap-4 mt-4 justify-center">
                            <Button type="submit" label="Buscar" class="w-[50%]" />
                        </div>
                    </form>
                </template>
            </Card>
            </div>
            <div v-if="Mesa && Ocupado" class="mx-auto p-2 w-1/2">
                <h1 class="font-bold text-lg text-center my-2">Mesa {{ Mesa.nombre }}</h1>
                <div>
                    <span class="font-bold text-md text-center my-2">
                        Cliente:
                    </span>
                    {{ Cabecera.cliente.nombre }}
                    {{ Cabecera.cliente.apellido }}
                </div>
                <div>
                    <span class="font-bold text-md text-center my-2">
                        Cedula:
                    </span>
                    {{ Cabecera.cliente.cedula }}
                </div>
                <div>
                    <span class="font-bold text-md text-center my-2">
                        Total Actual:
                    </span>
                    {{ Cabecera.total }}
                </div>
                <h1 class="font-bold text-lg text-center my-2">Detalles</h1>
                <table class="w-full shadow rounded-lg">
                    <thead>
                        <tr class="bg-gray-300">
                            <th class="p-2">Nombre</th>
                            <th class="p-2">Cantidad</th>
                            <th class="p-2">Precio Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="detalle in DetallesList" :key="detalle.id" class="border-b border-gray-200">
                            <td class="p-2">{{ detalle.producto.nombre }}</td>
                            <td class="p-2 text-center">{{ detalle.cantidad }}</td>
                            <td class="p-2 text-center">{{ detalle.producto.precio }}</td>
                        </tr>
                    </tbody>
                </table>
                
                <form @submit="handleSelectCliente">
                    <h1 class="font-bold text-lg text-center my-2">Cliente</h1>
                    <div class="w-1/2 mx-auto">
                        <selectSearch></selectSearch>
                    </div>
                    
                    <div class="flex gap-4 mt-4 justify-center">
                        <Button type="submit" label="Buscar" class="w-[50%]" />
                    </div>
                </form>
            </div>
            <div v-else>
                <h1 class="font-bold text-3xl text-center mt-4">DesOcupado</h1>
               
            </div>
        </div>

        <Dialog v-model:visible="visible" modal header="Error" :style="{ width: '25rem' }">
            <div class="card flex flex-wrap gap-4 m-1 justify-center">
                <Message v-if="MesaNula" severity="error">No hay restaurantes disponibles</Message>
            </div>
        </Dialog>
    </main>
</template>
