<template>
    
  <div>
    <!-- Tu título original anterior -->
    <h1> Personajes De Marvel </h1>
    
    <!-- Tu contenedor original anterior -->
    <div id="contenedor-card-h">
      <!-- Invocamos al componente reutilizable CardPersonaje 
           para que clone las tarjetas de Marvel de forma automática -->
      <CardPersonaje 
        v-for="heroe in listaHeroesFiltrada" 
        :key="heroe.id || heroe.name" 
        :personaje="heroe" 
      />
    </div>
  </div>


  </template>
  
  <script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'

  // CONECTAMOS EL CSS AQUÍ Así maneja el contenedor y las tarjetas de esta página
  import '@/assets/Heroes.css'

// Importamos el molde de tarjeta reutilizable que perfeccionamos 
import CardPersonaje from '@/components/CardPersonaje.vue'

// Creamos la lista vacía donde Vue guardará a tus héroes filtrados y listos
const listaHeroesFiltrada = ref([])

// Tu función async getDatos() ahora se ejecuta automáticamente cuando entras a la página (onMounted)
onMounted(async () => {
  try {
    console.log("esta funcionando el js de héroes en Vue")

    // CONEXIÓN PERFECTA CON AXIOS: Lee el archivo desde tu carpeta public
    const respuesta = await axios.get('/jsonheroes.json')
    
    // Axios guarda los datos directo en '.data'. Aplicamos tu lógica exacta:
    respuesta.data.slice(0, 30).forEach((personaje) => {
      console.log("Personaje:", personaje)
      console.log("Imagen:", personaje.images?.md)

      // Tu filtro original intacto de Marvel Comics y su imagen md
      if (
        personaje.biography?.publisher === "Marvel Comics" &&
        personaje.images?.md
      ) {
        // Mapeamos los datos para que tu molde CardPersonaje los entienda automáticamente
        const heroeMapeado = {
          id: personaje.id,
          name: personaje.name,
          image: personaje.images.md,
          house: 'marvel', // Se inyecta como clase en minúscula para tus estilos CSS
          
          // Guardamos tus 7 datos en las variables genéricas de la tarjeta
          ancestry: personaje.biography.fullName || 'No registrado',
          species: personaje.appearance.race || 'Desconocida',
          gender: personaje.biography.alignment === 'good' ? 'Héroe' : 'Villano',
          house_display: 'Marvel Comics', // Texto limpio para el campo de origen
          patronus: `Inteligencia: ${personaje.powerstats.intelligence}% | Fuerza: ${personaje.powerstats.strength}%`,
          actor: `Velocidad: ${personaje.powerstats.speed}% | Durabilidad: ${personaje.powerstats.durability}%`
        }

        listaHeroesFiltrada.value.push(heroeMapeado)
      }
    })

  } catch (error) {
    // Tu mismo control de errores anterior
    console.error("este es el error:", error)
  }
})
</script>
