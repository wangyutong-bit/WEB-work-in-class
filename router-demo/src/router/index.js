import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/login',
    name:'login',
    component:LoginView

  },
  {
    path: '/users',
    name: 'usersView',
    component: () => import(/* webpackChunkName: "usersView" */ '../views/usersView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
   {
    path:'/proudects',
    name:'proudects',
    component:() => import('../views/proudects.vue'),
    children: [
      {
        path:'js',
        name:'js',
        component:() => import('../views/js.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
