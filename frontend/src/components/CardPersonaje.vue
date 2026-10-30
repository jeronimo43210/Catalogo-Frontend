<template>
  <!-- Sincronizamos tu truco de la casa con el objeto que viene de la vista -->
  <div class="fila-card" :class="personaje.house ? personaje.house.toLowerCase() : ''">
    
    <!-- Usamos tus variables calculadas del script en el HTML -->
    <img :src="personaje.image" :alt="nombre">
    <h2>{{ nombre }}</h2>
    
    <div class="info-personaje">
      <p><strong>Especie:</strong> {{ especie }}</p>
      <p><strong>Genero:</strong> {{ genero }}</p>
      <p><strong>Casa:</strong> {{ casa }}</p>
      <p><strong>Linaje:</strong> {{ linaje }}</p>
      <p><strong>Patronus:</strong> {{ patronus }}</p>
      <p><strong>Actor:</strong> {{ actor }}</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  personaje: {
    type: Object,
    required: true
  }
})

// Tus 7 variables calculadas se quedan exactamente igual abajo:
const nombre = computed(() => props.personaje.name || 'No registrado')
const especie = computed(() => props.personaje.species || 'No registrada')
const genero = computed(() => props.personaje.gender || 'No registrado')
const casa = computed(() => props.personaje.house || 'Ninguna')
const linaje = computed(() => props.personaje.ancestry || 'Desconocido')
const patronus = computed(() => props.personaje.patronus || 'Ninguno')
const actor = computed(() => props.personaje.actor || 'No disponible')
</script>
