<template>
<el-dialog v-model="dialogVisible"   @close="gogo(1)">
    <div class="box1">
      <div class="box2">
        <img :src="$route.params.gpicture" class="image"/>
     </div>
     <div class="box3">
          <p class="myfont"> 商品名：<span>{{$route.params.gname}}</span></p>
          <p class="myfont"> 原价：<span>&yen;<strike>{{$route.params.goprice}}</strike></span></p>
          <p> <span class="myfont">折扣价：</span><span style="color: rgb(249, 7, 7); font-size: 10pt;">&yen;{{$route.params.grprice}}</span></p>
          <p  class="myfont"> 类型：<span>{{$route.params.typename}}</span></p>
          <p> <el-input v-model="inputvalue" class="w-50 m-2" size="small" placeholder="请输入购买量" /></p>
          <p>
            <el-button type="primary" :icon="ShoppingCart" class="button"  @click="gogo(2)" size="small">加入购物车</el-button>
            <el-button type="warning" :icon="Shop" class="button" size="small" @click="gogo(3)">立刻购买</el-button>
            <el-button type="success" :icon="CirclePlusFilled" class="button" size="small" @click="gogo(4)">收藏</el-button>
          </p>
    </div>
   </div>
</el-dialog>
</template>
<script setup>
import { useRouter} from 'vue-router'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, CirclePlusFilled, Shop } from '@element-plus/icons-vue'
const router = useRouter()//相当于this.$router，一般具有功能性，例如路由跳转
const dialogVisible = true
const inputvalue = ref('')
const gogo = (myValue) => {
    if(myValue != 1 && sessionStorage.getItem('uname') === null) {
        router.replace('/login')
        return false
    }
    if(myValue === 2 || myValue === 3){
      if(inputvalue.value === ''){
        ElMessageBox.alert(
          '<span style="color: rgb(249, 7, 7); font-size: 12pt;">请输入购买量！</span>',
          '',
          {
            dangerouslyUseHTMLString: true,
          }
        )
        return false
      }
    }
    if(myValue === 2 )
        ElMessage({message: '成功加入购物车',type: 'success'})
    if(myValue === 3 )
        ElMessage({message: '成功购买',type: 'success'})
    if(myValue === 4 )
        ElMessage({message: '成功收藏',type: 'success'})
    router.go(-1)
}
</script>

<style scoped>
.myfont {
  font-size: 10pt;
  color: rgb(125, 123, 123);
}
.image {
  width: 230px;
  height: 200px; 
  display: block;
}
.box1 {
  width:460px;
  display: flex;
  justify-content: space-between;
}
.box2 {
  width:230px;
}
.box3 {
  width:210px;
}
.button {
  padding: 0;
  min-height: auto;
}
</style>