<template>
     <el-dialog title="我的购物车" v-model="myfocusVisible" width="62%" @close="goClose">
      <el-table :data="goodslists"  border>
        <el-table-column label="图片" width="80">
          <template #default="scope">
            <el-link @click="goToGoodsDetail(scope.row)">
                <el-image  :src="scope.row.gpicture" style="width: 50px; height: 50px;"/>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column  label="商品名称" width="155">
            <template #default="scope">
            <el-link @click="goToGoodsDetail(scope.row)" :underline="false">
                <span>{{scope.row.gname}}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="商品实价" width="105">
          <template #default="scope">
            <span>{{scope.row.grprice.toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="购买量"  width="150">
            <template #default="scope">
                <el-button size="small" type="success"  @click="reduce(scope.row)" :disabled="scope.row.shopnum === 1">-</el-button>
                <span>&nbsp;{{scope.row.shopnum}}&nbsp;</span>
                <el-button size="small" type="success"   @click="add(scope.row)">+</el-button>
             </template>
        </el-table-column>
        <el-table-column  label="小计"  width="150">
             <template #default="scope">
                <span>{{(scope.row.grprice * scope.row.shopnum).toFixed(1)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="删除" width="100">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="danger" :icon="Delete" circle  @click="remove(scope.row)"/>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <div>总价：¥ {{ totalPrice.toFixed(1) }} &nbsp;
       <el-button  type="danger" :icon="Delete"  @click="removeAll">清空</el-button>
      </div>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { Delete } from '@element-plus/icons-vue'
const router = useRouter()
const route = useRoute() 
const myfocusVisible = ref(true) 
const goodslists = reactive([
    {
        goodsid: 1, gname: '水果1号', goprice: 10.0, grprice: 8.0, gstore: 1000, 
        shopnum: 10, gpicture: require("../assets/6.jpg"), typeid: 1, typename: '水果'
    },
    {
        goodsid: 2, gname: '家电1号', goprice: 1000.0, grprice: 800.0, gstore: 2000,
        shopnum: 5, gpicture: require("../assets/7.jpg"), typeid: 2, typename: '家电'
    },
    {
        goodsid: 3, gname: '服装1号', goprice: 100.0, grprice: 88.0, gstore: 3000,
        shopnum: 20, gpicture: require("../assets/8.jpg"), typeid: 3, typename: '服装'
    }
])
const goToGoodsDetail = (goods) => {
    router.push({name: 'goodsDetail', params: goods })
}
const goClose = () => {
    //跳转到前一个页面
    let path = route.query.redirect
    router.replace({ path: path === '/' || path === undefined ? '/' : path })
}
const reduce = (goods) => {
    if(goods.shopnum === 1) 
        return
    goods.shopnum --
}
const add = (goods) => {
    goods.shopnum++
}
const remove = (goods) => {
    for (let i = 0;i < goodslists.length; i++){
        if (goodslists[i].goodsid === goods.goodsid){
            goodslists.splice(i,1);
            break
        }
    }
}
//使用计算属性计算总额
const totalPrice = computed( ()=> {
    let total = 0
    for (let i = 0; i < goodslists.length; i++) {
        let item = goodslists[i]
        total = total + item.grprice * item.shopnum
    }
    return total
})
const removeAll = () => {
   goodslists.splice(0)
}
</script>