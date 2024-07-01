
<template>
  <multiselect v-model="value" :options="options" :custom-label="nameWithLang" placeholder="Select one" label="name"
               track-by="name"></multiselect>
</template>
  
  <script>
    import Multiselect from 'vue-multiselect'
    let opciones = []
    await fetch('http://localhost:8000/api/cliente')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      opciones = opciones.concat(data)
    })
    console.log("opciones",opciones)

    export default {
      components: {
        Multiselect
      },
      data () {
        return {
          value: {name: 'Vue.js', language: 'JavaScript'},
          options: opciones
        }
      },
      methods: {
        nameWithLang ({cedula, nombre, apellido}) {
          return `${cedula} — ${nombre} ${apellido}`
        }
      }
    }
  </script>
  <style src="../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
