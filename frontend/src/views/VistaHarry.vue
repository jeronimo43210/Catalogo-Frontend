<template>
   
  <div>
    <!-- Tu título H1 original anterior -->
    <h1>Harry Potter</h1>
    
    <!-- Tu contenedor original anterior -->
    <div id="contenedor-card">
      <!-- Invocamos a tu componente para que clone las tarjetas automáticamente -->
      <CardPersonaje
        v-for="mago in listaFiltrada" 
        :key="mago.id || mago.name" 
        :personaje="mago" 
      />
    </div>
  </div>


  </template>
  
  <script setup>
// ¡CONECTAMOS EL CSS AQUÍ! Así maneja el contenedor y las tarjetas de esta página
import '@/assets/styleharry.css'

 import { ref, onMounted } from 'vue'
import axios from 'axios'

import CardPersonaje from '@/components/CardPersonaje.vue'

// Creamos la lista vacía donde Vue guardará a tus personajes filtrados
const listaFiltrada = ref([])

// Tu función async getDatos() ahora se ejecuta automáticamente cuando la página carga (onMounted)
onMounted(async () => {
  try {
    // Cambiamos tu fetch por Axios
    const respuesta = await axios.get('https://hp-api.onrender.com/api/characters')
    
    // Axios guarda los datos directo en '.data'. Aquí aplicamos tu lógica exacta:
    // Recorremos los personajes y SOLO guardamos los que tienen imagen válida
    respuesta.data.forEach((personaje) => {
      if (personaje.image && personaje.image !== '') {
        listaFiltrada.value.push(personaje)
      }
    })

  } catch (error) {
    // Tu mismo control de errores anterior
    console.error("este es el error:", error)
  }
})

  </script>
  
