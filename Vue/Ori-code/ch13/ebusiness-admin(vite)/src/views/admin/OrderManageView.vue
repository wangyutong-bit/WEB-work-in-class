<template>
  <el-tabs type="border-card">
    <el-tab-pane label="订单管理">
       <el-form :inline="true" :model="searchParam" class="fl">
				<el-form-item label="订单编号">
          <el-input v-model="searchParam.ordersn" placeholder="请输入订单编号" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit()">查询</el-button>
				</el-form-item>
			</el-form>
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
              <el-popconfirm v-if="scope.row.orderStatus === '未支付'" confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
                title="真的删除吗？" @confirm="confirmEvent(scope.row, scope.$index)" @cancel="cancelEvent">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background layout="total, prev, pager, next" v-model:currentPage="currentPage"
          :page-size="pageSize" :total="total" />
      </div>
    </el-tab-pane>
  </el-tabs>
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
  <el-dialog title="订单搜索结果" v-model="orderSearchVisible">
    <el-table :data="resultserach" border>
        <el-table-column type="expand">
          <template #default="props">
              <el-table :data="props.row.orderDetail" border>
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
          </template>
        </el-table-column>
        <el-table-column prop="ordersn"  label="订单编号" width="150"></el-table-column>
        <el-table-column label="订单金额" width="150">
          <template #default="scope">
            <span>{{scope.row.orderAmount.toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单时间" sortable width="150"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="150"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
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
let orderSearchVisible = ref(false)
let detailResult = reactive([{}])
let searchParam = reactive({})
 //查询结果
let resultserach = reactive([{}])
let total = ref(3)
let pageSize = ref(2)
let currentPage = ref(1)
const onSubmit = () => {//查询
  for(let i = 0; i < result.length; i++){
      if(result[i].ordersn ==  searchParam.ordersn){
        Object.assign(resultserach, [result[i]])
        break
      }
  }
  orderSearchVisible.value = true
}
//详情
const handleDetail = (row) => {
  //detailResult = reactive([{}])
  //detailResult = row.orderDetail这么写不能对reactive赋值
  Object.assign(detailResult, row.orderDetail)
  //删除多余的数据
  detailResult.splice(row.orderDetail.length, detailResult.length)
  orderDetailVisible.value = true
}
//删除
const confirmEvent = (row, index) => {
  //删除一个元素
  result.splice(index, 1)
  total.value = result.length
  ElMessage({message: '删除成功',type: 'success'})
}
const cancelEvent = () => {
}
</script>
