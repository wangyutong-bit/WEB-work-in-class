import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/admin/HomeView.vue'
import TypeManage from '../views/admin/TypeManageView.vue'
import GoodsManage from '../views/admin/GoodsManageView.vue'
import OrderManage from '../views/admin/OrderManageView.vue'
import LoginView from '../views/admin/LoginView.vue'
import SalesStatistics from '../views/admin/SalesStatisticsView.vue'
import OrderStatistics from '../views/admin/OrderStatisticsView.vue'
const routes = [
	{
		path: '/',
		component: LoginView
	},
	{
		path: '/home',
		name: 'home',
		component: HomeView,
		redirect: '/home/typemanage',
		meta:{auth:true},//需要验证登录权限
		children: [
			{
				path: '/home/typemanage',
				component: TypeManage
			},
			{
				path: '/home/goodsmanage',
				component: GoodsManage
			},
			{
				path: '/home/ordermanage',
				component: OrderManage
			},
			{
				path: '/home/salesstatistics',
				component: SalesStatistics
			},
			{
				path: '/home/orderstatistics',
				component: OrderStatistics
			}
		]
	},
]

const router = createRouter({
	//推荐使用HTML 5模式
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
