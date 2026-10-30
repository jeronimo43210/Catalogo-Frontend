import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Asegura que importe el archivo index.js de la carpeta router

const app = createApp(App)

app.use(router) // Aquí le inyectamos el router a Vue para solucionar el error de la consola

app.mount('#app')
