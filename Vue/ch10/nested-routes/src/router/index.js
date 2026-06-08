import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/product',
    name: 'product',
    component: ProductView,
    children:[//子路由
      {
        path: '',  //空子路由为基础路由的默认显示
        component: () => import('../views/AlldevView.vue')
      },
      {
        path: 'alldev',  //注意这里没有'/'
        component: () => import('../views/AlldevView.vue')
      },
      {
        path: 'JavaEE',
        component: () => import('../views/JavaEEView.vue')
      },
      {
        path: 'SpringBoot',
        component: () => import('../views/SpringBoot.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
