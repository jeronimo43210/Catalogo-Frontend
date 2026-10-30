import { createRouter, createWebHistory } from 'vue-router'
import VistaUser from '@/views/VistaUser.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'catalogo',
      component: VistaUser
    }
  ]
})

export default router
