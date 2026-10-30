<template>
  <main class="catalog-page">
    <header class="catalog-header">
      <p class="eyebrow">BIBLIOTECA DIGITAL</p>
      <h1>Catálogo multimedia</h1>
      <p class="intro">Explora y filtra tus archivos en un solo lugar.</p>
    </header>

    <section class="filters" aria-labelledby="filters-title">
      <div class="section-heading">
        <h2 id="filters-title">Filtrar por tipo</h2>
        <span v-if="!loading">{{ registros.length }} elementos cargados</span>
      </div>

      <div class="filter-list">
        <button
          class="filter-button"
          :class="{ active: tipoSeleccionado === '' }"
          :aria-pressed="tipoSeleccionado === ''"
          :disabled="loading"
          @click="aplicarFiltro('')"
        >
          Todos
        </button>
        <button
          v-for="faceta in facetas.tipos"
          :key="faceta.valor"
          class="filter-button"
          :class="{ active: tipoSeleccionado === faceta.valor }"
          :aria-pressed="tipoSeleccionado === faceta.valor"
          :disabled="loading"
          @click="aplicarFiltro(faceta.valor)"
        >
          {{ faceta.valor }} ({{ faceta.conteo }})
        </button>
      </div>
    </section>

    <p v-if="error" class="error-message" role="alert">{{ error }}</p>

    <section class="catalog-results" aria-label="Elementos multimedia">
      <CardUser
        v-for="registro in registros"
        :key="registro.id"
        :datos="registro"
      />
    </section>

    <p v-if="!loading && !error && registros.length === 0" class="empty-message">
      No hay elementos para mostrar con este filtro.
    </p>

    <div class="load-area">
      <p v-if="loading" class="loading-message" role="status">Cargando catálogo…</p>
      <button
        v-else-if="hayMas"
        class="load-button"
        type="button"
        @click="cargarCatalogo"
      >
        Cargar más
      </button>
      <p v-else-if="registros.length" class="end-message">Has llegado al final del catálogo.</p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CardUser from '@/components/CardUser.vue'

const API_URL = '/api/multimedia'
const registros = ref([])
const facetas = ref({ generos: [], tipos: [] })
const tipoSeleccionado = ref('')
const loading = ref(false)
const error = ref('')
const hayMas = ref(true)

// El backend pagina por id; lastCreatedAt queda reservado porque su respuesta no incluye created_at.
const cursor = ref({ lastId: null, lastCreatedAt: null })

async function cargarCatalogo() {
  if (loading.value || !hayMas.value) return

  loading.value = true
  error.value = ''

  const parametros = new URLSearchParams()
  if (cursor.value.lastId !== null) {
    parametros.set('cursor', String(cursor.value.lastId))
  }
  if (tipoSeleccionado.value) {
    parametros.set('tipo', tipoSeleccionado.value)
  }

  const consulta = parametros.toString()
  const url = consulta ? `${API_URL}?${consulta}` : API_URL

  try {
    const respuesta = await fetch(url)
    if (!respuesta.ok) {
      throw new Error(`La API respondió con estado ${respuesta.status}.`)
    }

    const resultado = await respuesta.json()
    if (resultado.success === false) {
      throw new Error(resultado.message || 'La API no pudo cargar el catálogo.')
    }
    if (!Array.isArray(resultado.data) || !resultado.facets ||
      !Array.isArray(resultado.facets.tipos) || !Array.isArray(resultado.facets.generos)) {
      throw new Error('La respuesta de la API no tiene el formato esperado.')
    }
    if (resultado.next_cursor !== null &&
      (!Number.isSafeInteger(resultado.next_cursor) || resultado.next_cursor < 0)) {
      throw new Error('La API devolvió un cursor de paginación no válido.')
    }

    const nuevosDatos = resultado.data
    // El cursor recibido identifica el último id de la página y permite pedir la siguiente sin OFFSET.
    cursor.value.lastId = resultado.next_cursor
    cursor.value.lastCreatedAt = null
    registros.value = [...registros.value, ...nuevosDatos]
    facetas.value = resultado.facets
    hayMas.value = resultado.next_cursor !== null
  } catch (fallo) {
    console.error('Error al cargar el catálogo multimedia:', fallo)
    error.value = fallo instanceof Error
      ? fallo.message
      : 'Ocurrió un error inesperado al cargar el catálogo.'
  } finally {
    loading.value = false
  }
}

function aplicarFiltro(tipo) {
  if (loading.value || tipoSeleccionado.value === tipo) return

  // Al cambiar la faceta se descarta el cursor anterior y la página acumulada para iniciar una consulta limpia.
  tipoSeleccionado.value = tipo
  cursor.value = { lastId: null, lastCreatedAt: null }
  registros.value = []
  facetas.value = { generos: [], tipos: [] }
  hayMas.value = true
  cargarCatalogo()
}

onMounted(cargarCatalogo)
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  padding: clamp(24px, 5vw, 64px);
  background:
    radial-gradient(ellipse at 12% 0%, rgb(55 82 129 / 22%), transparent 42%),
    #0b111c;
  color: #e8edf5;
  font-family: Inter, "Segoe UI", sans-serif;
}

.catalog-header,
.filters,
.catalog-results,
.load-area,
.error-message,
.empty-message {
  width: min(1160px, 100%);
  margin-right: auto;
  margin-left: auto;
}

.catalog-header {
  margin-bottom: 40px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #91b7f4;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(2rem, 5vw, 3.6rem);
  letter-spacing: -0.045em;
}

.intro {
  margin: 14px 0 0;
  color: #9eacc1;
  font-size: 1.05rem;
}

.filters {
  margin-bottom: 28px;
  padding: 20px;
  border: 1px solid #263247;
  border-radius: 16px;
  background: rgb(18 27 42 / 84%);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  font-size: 1rem;
}

.section-heading span {
  color: #8f9db1;
  font-size: 0.85rem;
}

.filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-button,
.load-button {
  border: 1px solid #3a4b66;
  border-radius: 9px;
  background: #1a2639;
  color: #dce6f5;
  cursor: pointer;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 14px;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.filter-button:hover:not(:disabled),
.load-button:hover:not(:disabled) {
  border-color: #8bb5f5;
  background: #263a58;
}

.filter-button.active {
  border-color: #8bb5f5;
  background: #31517f;
  color: #fff;
}

.filter-button:disabled,
.load-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.catalog-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  gap: 18px;
}

.error-message,
.empty-message,
.loading-message,
.end-message {
  color: #aab6c8;
  text-align: center;
}

.error-message {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #8f3945;
  border-radius: 10px;
  background: #321c25;
  color: #ffbdc5;
  padding: 14px;
}

.empty-message {
  margin-top: 32px;
}

.load-area {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
}

.load-button {
  min-width: 150px;
  border-color: #527bb8;
  background: #27446e;
  color: #fff;
}

.loading-message,
.end-message {
  margin: 0;
}

@media (max-width: 520px) {
  .catalog-page {
    padding: 24px 16px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
