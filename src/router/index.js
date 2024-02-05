import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/Info.vue')
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../views/Draw.vue')
    }
  ]
})

export default router
