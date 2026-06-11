import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import IndexView from '../views/IndexView.vue'
import GoodsDetailView from '../views/GoodsDetailView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import MyselfInfoView from '../views/MyselfInfoView.vue'
import MyOrderView from '../views/MyOrderView.vue'
import MyFocusView from '../views/MyFocusView.vue'
import MyCartView from '../views/MyCartView.vue'
const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexView
  },
  {
    path: '/goodsDetail',
    name: 'goodsDetail',
    component: GoodsDetailView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/myselfinfo',
    name: 'myselfinfo',
    component: MyselfInfoView,
    meta: {auth:true}//需要验证登录权限
  },
  {
    path: '/myorder',
    name: 'myorder',
    component: MyOrderView,
    meta: {auth:true}//需要验证登录权限
  },
  {
    path: '/myfocus',
    name: 'myfocus',
    component: MyFocusView,
    meta: {auth:true}//需要验证登录权限
  },
  {
    path: '/mycart',
    name: 'mycart',
    component: MyCartView,
    meta: {auth:true}//需要验证登录权限
  }

  
]
const router = createRouter({
  //推荐使用HTML 5模式
	history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
