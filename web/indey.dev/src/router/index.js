import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PricesView from '@/views/PricesView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/prices',
      name: 'prices',
      component: PricesView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/repo',
      name: 'repo',
      beforeEnter: () => {
        location.href = 'https://github.com/fine-solutions/indey'
      }
    },
  ],
})

export default router
