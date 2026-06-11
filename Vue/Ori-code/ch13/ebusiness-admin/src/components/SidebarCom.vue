<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff"
			unique-opened router>
			<template v-for="item in state.items">
				<template v-if="item.subs">
					<el-sub-menu :index="item.index" :key="item.index">
						<template #title>
							<el-icon>
								<Menu />
							</el-icon>
							{{ item.title }}
						</template>
						<template v-for="subItem in item.subs">
							<el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template #title>
									<ElIcon>
										<edit />
									</ElIcon>
									{{ subItem.title }}
								</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
									<ElIcon>
										<edit />
									</ElIcon>
									{{ threeItem.title }}
								</el-menu-item>
							</el-sub-menu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index + 1">
								<ElIcon>
									<edit />
								</ElIcon>
								{{ subItem.title }}
							</el-menu-item>
						</template>
					</el-sub-menu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<template #title>
							<el-icon>
								<Menu />
							</el-icon>
							{{ item.title }}
						</template>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>
<script setup>
import {
	reactive
} from "vue";
const state = reactive({
	items: [
		{
			index: "1",
			title: "管理模块",
			subs: [
				{
					index: "typemanage",
					title: "类型管理"
				},
				{
					index: "goodsmanage",
					title: "商品管理"
				},
				{
					index: "ordermanage",
					title: "订单管理"
				}
			],
		},
		{
			index: "2",
			title: "统计模块",
			subs: [
				{
					index: "salesstatistics",
					title: "销量统计"
				},
				{
					index: "orderstatistics",
					title: "订单统计"
				}
			],
		}
	]
});
</script>
<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
	background: pink;
}

.sidebar::-webkit-scrollbar {
	width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}

.sidebar>ul {
	height: 100%;
	text-align: left;
}
</style>
