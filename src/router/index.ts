import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '../views/MapPage.vue'
import UIKitPage from '../views/UIKitPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/map?category=projects'
    },
    {
      path: '/map',
      name: 'map',
      component: MapPage
    },
    {
      path: '/ui-kit',
      name: 'ui-kit',
      component: UIKitPage
    }
  ]
})

export default router