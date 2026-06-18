import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PlayerView from '../views/PlayerView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import { getSession } from '../composables/useAuth'

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/player', name: 'player', component: PlayerView, meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favorites', component: FavoritesView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getSession()) {
    next({ name: 'login' })
  } else if (to.name === 'login' && getSession()) {
    next({ name: 'player' })
  } else {
    next()
  }
})

export default router
