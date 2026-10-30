<template>
  <article class="media-card">
    <div class="card-heading">
      <span class="media-icon" aria-hidden="true">{{ emoji }}</span>
      <span class="media-type">{{ tipo }}</span>
    </div>

    <h2 class="media-title">{{ titulo }}</h2>
    <p class="media-description">{{ descripcion }}</p>

    <footer class="card-footer">
      <span>{{ fecha }}</span>
      <span v-if="datos.genero" class="media-genre">{{ datos.genero }}</span>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  datos: {
    type: Object,
    required: true
  }
})

const tipo = computed(() => String(props.datos.tipo || 'archivo').toLowerCase())
const titulo = computed(() => props.datos.title || props.datos.titulo || 'Sin título')
const descripcion = computed(() => {
  if (props.datos.description) return props.datos.description

  const detalles = [props.datos.anio, props.datos.duracion]
    .filter((detalle) => detalle !== null && detalle !== undefined && detalle !== '')

  return detalles.length
    ? `Año y duración: ${detalles.join(' · ')}`
    : 'Sin descripción disponible'
})

const emoji = computed(() => ({
  video: '🎬',
  audio: '🎵',
  image: '🖼️',
  document: '📁'
}[tipo.value] || '📦'))

const fecha = computed(() => {
  if (props.datos.created_at) {
    const fechaCreacion = new Date(props.datos.created_at)

    if (!Number.isNaN(fechaCreacion.getTime())) {
      return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(fechaCreacion)
    }
  }

  return props.datos.anio ? `Año ${props.datos.anio}` : 'Fecha no disponible'
})
</script>

<style scoped>
.media-card {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border: 1px solid #283449;
  border-radius: 16px;
  background: linear-gradient(145deg, #151e2e, #101725);
  box-shadow: 0 12px 30px rgb(0 0 0 / 18%);
  color: #e8edf5;
  transition: border-color 160ms ease, transform 160ms ease;
}

.media-card:hover {
  transform: translateY(-3px);
  border-color: #617ba8;
}

.card-heading,
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.media-icon {
  font-size: 1.8rem;
}

.media-type {
  padding: 5px 10px;
  border-radius: 999px;
  background: #263650;
  color: #c4d5f2;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.media-title {
  margin: 0;
  color: #fff;
  font-size: 1.15rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.media-description {
  flex: 1;
  margin: 0;
  color: #aab6c8;
  line-height: 1.6;
}

.card-footer {
  border-top: 1px solid #283449;
  padding-top: 14px;
  color: #93a2b8;
  font-size: 0.82rem;
}

.media-genre {
  color: #b9cae7;
  text-align: right;
}
</style>
