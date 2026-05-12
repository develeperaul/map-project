import { createRouter, createWebHashHistory } from 'vue-router'
import MapPage from '../views/MapPage.vue'
import UIKitPage from '../views/UIKitPage.vue'
import AuthView from '../views/AuthView.vue'
import { resolveAuthRedirect, useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // {
    //   // path: '/',
    //   // redirect: '/map?category=projects'
    // },
    {
      path: '/',
      name: 'map',
      alias: '/map',
      component: MapPage
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/ui-kit',
      name: 'ui-kit',
      component: UIKitPage
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthRoute = to.name === 'auth'

  if (!authStore.isAuthenticated && !isAuthRoute) {
    return {
      name: 'auth',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (authStore.isAuthenticated && isAuthRoute) {
    return resolveAuthRedirect(to.query.redirect) ?? {
      name: 'map',
      query: { category: 'projects' },
    }
  }

  return true
})

export default router
