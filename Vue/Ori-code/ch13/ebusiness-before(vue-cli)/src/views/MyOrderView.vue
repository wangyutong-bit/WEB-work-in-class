<template>
    <el-dialog title="我的订单" v-model="myordeVisible" width="60%" @close="goClose">
      <el-table :data="result"  :default-sort="{ prop: 'orderDate', order: 'descending' }" border>
        <el-table-column prop="ordersn" label="订单编号" width="150"></el-table-column>
        <el-table-column label="订单金额" width="150">
          <template #default="scope">
            <span>{{scope.row.orderAmount.toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单时间" sortable width="150"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="150"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="primary"  @click="handleDetail(scope.row)">详情</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background layout="total, prev, pager, next" v-model:currentPage="currentPage"
          :page-size="pageSize" :total="total" />
      </div>
  </el-dialog>
  <el-dialog title="订单详情" v-model="orderDetailVisible">
    <el-table :data="detailResult" border>
        <el-table-column prop="gno" label="商品编号" width="120"></el-table-column>
        <el-table-column prop="gname" label="商品名称" width="120"></el-table-column>
        <el-table-column  label="单价" width="120">
          <template #default="scope">
            <span>{{scope.row.gprice.toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopNum" label="数量" width="120"></el-table-column>
        <el-table-column  label="小计" width="120">
           <template #default="scope">
            <span>{{scope.row.smallTotal.toFixed(1)}}</span>
          </template>
        </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'
const router = useRouter()
const route = useRoute() 
let result = reactive([
  {
    ordersn: 1000,
    orderAmount: 281.6,
    orderDate: '2022-08-10',
    orderStatus: '已支付',
    orderUserId: 100,
    orderDetail: [
      {
        gno: 10000,
        gname: '苹果1号',
        gprice: 12.8,
        shopNum: 2,
        smallTotal: 25.6
      },
       {
        gno: 10001,
        gname: '服装1号',
        gprice: 128.0,
        shopNum: 2,
        smallTotal: 256.0
      }
    ]
  },
  {
    ordersn: 1001,
    orderAmount: 264.0,
    orderDate: '2022-10-15',
    orderStatus: '未支付',
    orderUserId: 101,
    orderDetail: [
       {
        gno: 10002,
        gname: '文具1号',
        gprice: 88.0,
        shopNum: 3,
        smallTotal: 264.0
      }
    ]
  },
  {
    ordersn: 1002,
    orderAmount: 2343.0,
    orderDate: '2022-11-11',
    orderStatus: '未支付',
    orderUserId: 102,
    orderDetail: [
      {
        gno: 10003,
        gname: '家电2号',
        gprice: 999.0,
        shopNum: 1,
        smallTotal: 999.0
      },
       {
        gno: 10004,
        gname: '家具1号',
        gprice: 1280.0,
        shopNum: 1,
        smallTotal: 1280.0
      },
      {
        gno: 10005,
        gname: '蔬菜1号',
        gprice: 12.8,
        shopNum: 5,
        smallTotal: 64.0
      }
    ]
  }
])
let orderDetailVisible = ref(false)
const myordeVisible = ref(true) 
let detailResult = reactive([{}])
let total = ref(3)
let pageSize = ref(2)
let currentPage = ref(1)
//详情
const handleDetail = (row) => {
  //detailResult = reactive([{}])
  //detailResult = row.orderDetail这么写不能对reactive赋值
  Object.assign(detailResult, row.orderDetail)
  //删除多余的数据
  detailResult.splice(row.orderDetail.length, detailResult.length)
  orderDetailVisible.value = true
}
const goClose = () => {
    //跳转到前一个页面
    let path = route.query.redirect
    router.replace({ path: path === '/' || path === undefined ? '/' : path })
}
</script>
