import { createRouter, createWebHistory } from 'vue-router'
import ReservasView from '../views/ReservasView.vue'
import MesasView from '../views/MesasView.vue'

  
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mesas',
      name: 'mesas',
      component: MesasView
    },
    {
      path: '/',
      name: 'reservas',
      component: ReservasView
    },
    {
      path: '/reservas',
      name: 'reservas_lista',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ReservasListaView.vue')
    }
  ]
})

export default router
