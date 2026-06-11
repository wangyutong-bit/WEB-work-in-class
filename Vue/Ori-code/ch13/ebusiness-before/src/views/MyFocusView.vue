<template>
     <el-dialog title="我的收藏" v-model="myfocusVisible" width="47%" @close="goClose">
      <el-table :data="goodslists"  border>
        <el-table-column label="图片" width="80">
          <template #default="scope">
            <el-image :src="scope.row.gpicture" style="width: 50px; height: 50px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="gname" label="商品名称" width="160"></el-table-column>
        <el-table-column label="商品实价" width="100">
          <template #default="scope">
            <span>{{scope.row.grprice.toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typename" label="商品类型"  width="100"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="primary"  @click="goToGoodsDetail(scope.row)">详情</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background layout="total, prev, pager, next" v-model:currentPage="currentPage"
          :page-size="pageSize" :total="total" />
      </div>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'
const router = useRouter()
const route = useRoute() 
const myfocusVisible = ref(true) 
const goodslists = reactive([
    {
        goodsid: 1,
        gname: '水果1号',
        goprice: 10.0,
        grprice: 8.0,
        gstore: 1000,
        gpicture: require("../assets/6.jpg"),
        typeid: 1,
        typename: '水果'
    },
    {
        goodsid: 2,
        gname: '家电1号',
        goprice: 1000.0,
        grprice: 800.0,
        gstore: 2000,
        gpicture: require("../assets/7.jpg"),
        typeid: 2,
        typename: '家电'
    },
    {
        goodsid: 3,
        gname: '服装1号',
        goprice: 100.0,
        grprice: 88.0,
        gstore: 3000,
        gpicture: require("../assets/8.jpg"),
        typeid: 3,
        typename: '服装'
    }
])
let total = ref(3)
let pageSize = ref(2)
let currentPage = ref(1)
const goToGoodsDetail = (goods) => {
    router.push({name: 'goodsDetail', params: goods })
}
const goClose = () => {
    //跳转到前一个页面
    let path = route.query.redirect
    router.replace({ path: path === '/' || path === undefined ? '/' : path })
}
</script>
<style scoped>
</style>