<template>

<header>   

 <h1> PAGINA PRINCIPAL</h1>

<button @click="router.push('/harry')">pagina 1</button> 
<button @click="router.push('/temalibre')">pagina 2</button>
<button @click="router.push('/UserPerfil')">pagina 3</button> 

</header>

  
 <p> mostrar pagina</p>

 <!-- para que el visor use el diseño responsivo de tu CSS-->
 <div id="visor">
 <router-view />
 </div>

  </template>
  
  <script setup>
  import '@/assets/PagPrincipal.css'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  </script>
  
