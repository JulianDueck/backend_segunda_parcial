<script setup lang="ts">
import { computed, ref } from "vue";
import { jsPDF } from "jspdf";

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

const clientes = ref([] as any);

fetch(`${baseUrl}/api/cliente/`, {
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((response) => response.json())
    .then((data) => {
        clientes.value = data;
    })
    .catch((err) => {
        console.error(err);
    });

const validMesa = computed(() => {
    return selectedMesa.value !== undefined;
});

const Mesa = ref();
const MesaNula = ref(false);
const Ocupado = ref<boolean | null>(null);

const DetallesList = ref([] as any);
const Cabecera = ref()
const productos = ref([] as any);

const getProductos = async () => {
    const data = await fetch(`${baseUrl}/api/producto/`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    productos.value = await data.json();
};

const getDetalles = async () => {

    Cabecera.value = await fetch(`${baseUrl}/api/cabecera/${Cabecera.value.id}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());

    const data = await fetch(`${baseUrl}/api/detalle/${Cabecera.value.id}`, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    const detalles = await data.json();
    console.log(detalles)
    if (detalles.find) {
        return detalles.detalles;
    } else {
        return [];
    }
}

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (validMesa.value) {
        const response = await fetch(`${baseUrl}/api/cabecera/mesa/ocupacion/${selectedMesa.value.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            Cabecera.value = await response.json();
            DetallesList.value = await getDetalles();
            await getProductos();
            Mesa.value = selectedMesa.value;
            Ocupado.value = true;
        } else if (response.status === 404) {
            Ocupado.value = false;
            await getProductos();
        }

    } else {
        console.log("Formulario inválido");
        visible.value = true;
    }
};

const selectedCliente = ref()

const ocuparMesa = async (e: Event) => {
    e.preventDefault();
    const body = {
        id_cliente: selectedCliente.value.id,
        id_mesa: selectedMesa.value.id,
        estado: "abierto",
    }
    const response = await fetch(`${baseUrl}/api/cabecera/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (response.ok && response.status === 201) {
        Cabecera.value = await response.json();
        DetallesList.value = await getDetalles();
        Mesa.value = selectedMesa.value;
        Ocupado.value = true;
    }
    // location.reload()
}

const agregarProducto = ref(false);
const cantidad = ref(0)
const selectedProducto = ref()

const handleAgregarProducto = async () => {
    const body = {
        id_cabecera: Cabecera.value.id,
        id_producto: selectedProducto.value.id,
        cantidad: cantidad.value,
    }
    const response = await fetch(`${baseUrl}/api/detalle/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (response.ok) {
        DetallesList.value = await getDetalles();
        agregarProducto.value = false;
    }
}

const total = computed(() => {
    return DetallesList.value.reduce((acc: any, item: any) => acc + (item.cantidad * item.producto.precio), 0);
});

const pagarConsumo = async () => {
    const response = await fetch(`${baseUrl}/api/cabecera/cerrar/${Cabecera.value.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ total: total.value }),
    });
    if (response.ok) {
        Ocupado.value = false;
        generatePdf();
    }
}

const cambiarCliente = ref(false)

const visible = ref(false);

const crearUsuario = ref(false);
const nombre = ref("");
const apellido = ref("");
const cedula = ref("")

const handleCambiarCliente = async () => {
    const dataCliente = {
        id_cliente: selectedCliente.value.id,
    }
    const response = await fetch(`${baseUrl}/api/cabecera/${Cabecera.value.id}/updateCliente`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataCliente),
    })
    if(response.ok) {
        getDetalles();
    }
    cambiarCliente.value = false;
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
            selectedCliente.value = data;
            handleCambiarCliente();
        })
        .catch((err) => {
            console.error(err);
        }).finally(() => {
            crearUsuario.value = false;
            nombre.value = "";
            apellido.value = "";
        });
};

const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Factura nro: " + Cabecera.value.id, 10, 10);
    doc.text("Fecha: " + new Date().toDateString(), 10, 20);
    doc.text("Cliente: " + Cabecera.value.cliente.nombre + " " + Cabecera.value.cliente.apellido, 10, 30);
    doc.text("Cedula: " + Cabecera.value.cliente.cedula, 10, 40);
    doc.text("Mesa: " + Mesa.value.nombre, 10, 50);
    doc.line(10, 60, 200, 60);
    doc.text("Producto", 10, 80);
    doc.text("Cantidad", 80, 80);
    doc.text("Precio Unitario", 140, 80);
    DetallesList.value.forEach((detalle: any, index: number) => {
        doc.text(detalle.producto.nombre, 10, 90 + index * 10);
        doc.text(detalle.cantidad.toString(), 80, 90 + index * 10);
        doc.text(detalle.producto.precio.toString(), 140, 90 + index * 10);
    });
    doc.text("Total: " + total.value.toString(), 140, 90 + DetallesList.value.length * 10);
    doc.save("factura.pdf");
}
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
                                <Select v-model="selectedMesa" :options="mesas" optionLabel="nombre"
                                    placeholder="Seleccione una mesa" class="w-[50%]" />
                            </div>

                            <div class="flex gap-4 mt-4 justify-center">
                                <Button type="submit" label="Buscar" class="w-[50%]" />
                            </div>
                        </form>
                    </template>
                </Card>
            </div>
            <div v-if="Ocupado === true" class="mx-auto p-2 w-1/2">
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
                    <Button label="Cambiar Cliente" @click="cambiarCliente = !cambiarCliente" />
                </div>
                <div>
                    <span class="font-bold text-md text-center my-2">
                        Total Actual:
                    </span>
                    {{ total }}
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
                    <tbody v-if="DetallesList.length > 0">
                        <tr v-for="detalle in DetallesList" :key="detalle.id" class="border-b border-gray-200">
                            <td class="p-2">{{ detalle.producto.nombre }}</td>
                            <td class="p-2 text-center">{{ detalle.cantidad }}</td>
                            <td class="p-2 text-center">{{ detalle.producto.precio }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="flex gap-4 mt-4 justify-center">
                    <Button label="Agregar Producto" class="w-[50%]"
                        @click="() => agregarProducto = !agregarProducto" />
                    <Button label="Pagar" class="w-[50%]" @click="pagarConsumo" />
                </div>
            </div>
            <div v-else-if="selectedMesa !== undefined && Ocupado === false">
                <h1 class="font-bold text-3xl text-center mt-4">Desocupado</h1>
                <form class="flex justify-center mt-2 gap-2" @submit="ocuparMesa">
                    <Select v-model="selectedCliente" :options="clientes" optionLabel="cedula"
                        placeholder="Seleccione un cliente" />
                    <Button label="Ocupar" type="submit" />
                </form>
            </div>
        </div>

        <Dialog v-model:visible="visible" modal header="Error" :style="{ width: '25rem' }">
            <div class="card flex flex-wrap gap-4 m-1 justify-center">
                <Message v-if="MesaNula" severity="error">No hay restaurantes disponibles</Message>
            </div>
        </Dialog>

        <Dialog v-model:visible="agregarProducto" modal header="Agregar Producto" :style="{ width: '25rem' }">
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Producto</label>
                <Select v-model="selectedProducto" :options="productos" optionLabel="nombre"
                    placeholder="Seleccione un producto" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="cantidad" class="font-semibold w-24">Cantidad</label>
                <InputText id="cantidad" v-model="cantidad" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="agregarProducto = false"></Button>
                <Button type="button" label="Agregar" @click="handleAgregarProducto"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="cambiarCliente" modal header="Cambiar Cliente" :style="{ width: '25rem' }">
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Cedula</label>
                <Select v-model="selectedCliente" :options="clientes" optionLabel="cedula"
                    placeholder="Seleccione un producto" class="flex-auto" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Crear Nuevo Cliente" severity="secondary"
                    @click="() => { cambiarCliente = !cambiarCliente; crearUsuario = !crearUsuario }"></Button>
                <Button type="button" label="Seleccionar" @click="handleCambiarCliente"></Button>
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
                <Button type="button" label="Crear y Seleccionar" @click="handleCrearUsuario"></Button>
            </div>
        </Dialog>
    </main>
</template>
