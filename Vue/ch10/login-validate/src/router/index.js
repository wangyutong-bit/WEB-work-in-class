import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import Main from '../views/MainView.vue'
import Home from '../views/HomeView.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{auth:true}
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    meta:{auth:true}//需要验证登录权限
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
