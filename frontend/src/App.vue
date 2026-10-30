<template>
  <div id="app">
    <!-- Esto llamará directamente a tu VistaUser.vue original sin intermediarios -->
    <router-view />
  </div>
</template>

<script setup>
// Código limpio sin componentes demo cargados
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #111827;
  font-family: sans-serif;
  color: #ffffff;
}
#app {
  min-height: 100vh;
}
</style>
