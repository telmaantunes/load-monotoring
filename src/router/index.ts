import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '@/layouts/BaseLayout.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { layout: BlankLayout },
      component: HomeView,
    },
    {
      path: '/all',
      name: 'all',
      meta: { layout: BlankLayout },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AllView.vue'),
    },
    {
      path: '/:catchAll(.*)', // This will catch all undefined routes
      name: 'NotFound',
      meta: { layout: BlankLayout },
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
