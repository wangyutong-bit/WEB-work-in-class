<template>
    <el-container>
      <el-header style="height: 30px; background-color: #f8f8ff">
        <el-row align="middle" style="margin-top: 5px">
          <el-col :span="3"><div class="coldiv">欢迎光临eBusiness</div></el-col>
          <el-col :span="1">
            <div class="coldiv">
              <el-link @click="register" :underline="false">注册</el-link>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="coldiv">
              <span v-if="userName != null">{{userName}}</span>
              <el-link @click="login" v-if="userName === null" :underline="false">登录</el-link>
            </div>
          </el-col>
          <el-col :span="9"><div></div></el-col>
          <el-col :span="2">
            <div class="coldiv">
              <el-link @click="myselfinfo"  :underline="false">个人信息</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="coldiv">
              <el-link @click="mycart"   :underline="false">我的购物车</el-link>
            </div></el-col>
          <el-col :span="2">
            <div class="coldiv">
              <el-link @click="myfocus"  :underline="false">我的收藏</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="coldiv">
              <el-link @click="myorder"  :underline="false">我的订单</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="coldiv">
              <el-link  @click="loginOut" :underline="false">安全退出</el-link>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <div>
        <el-carousel  :interval="5000" arrow="always" height="200px">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <img :src="item.src" :title="item.title" alt="图片丢失了" style="height:100%; width:100%;"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <el-footer style="height: 35px; background-color: #f8f8ff">
        <el-row  style="margin-top: 5px">
          <el-col :span="18">
            <el-row>
              <el-col :span="2" v-for="item in goodstypes" :key="item.typeid">
                  <div class="coldiv">
                    <el-link @click="toIndex(item.typeid)"  :underline="false">{{item.typename}}</el-link>
                  </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
                <el-form-item>
                  <el-input v-model="searchForm.gname" placeholder="输入商品名模糊搜索" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="toSearchIndex()" :icon="Search">搜索</el-button>
                </el-form-item>
              </el-form>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
</template>
<script setup>
import { reactive, defineEmits } from 'vue'
import { useRouter} from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage} from 'element-plus'
const router = useRouter()
const userName = sessionStorage.getItem("uname")
//使用defineEmits声明向父组件抛出的自定义事件
const myemits = defineEmits(['goIndex', 'searchIndex'])
const toIndex = (typeid) => {
  //通过抛出goIndex事件向父组件传值
  myemits('goIndex', typeid)
}
const toSearchIndex = () => {
  //通过抛出goIndex事件向父组件传值
  myemits('searchIndex', searchForm.gname)
}
const searchForm = reactive({
  gname: ''
})
const loginOut = () => {
  sessionStorage.removeItem("uname")
  ElMessage({message: '成功安全退出！', type: 'success'})
  //刷新当前页
  router.go(0)
}
const myorder = () => {
  router.push({name: 'myorder'})
}
const register = () => {
  router.push({name: 'register'})
}
const login = () => {
  router.push({name: 'login'})
}
const mycart = () => {
  router.push({name: 'mycart'})
}
const myselfinfo = () => {
  router.push({name: 'myselfinfo'})
}
const myfocus = () => {
  router.push({name: 'myfocus'})
}
const goodstypes =
  [{
      typeid: 0,
      typename: '首页'
    },
    {
      typeid: 1,
      typename: '水果'
    },
    {
      typeid: 2,
      typename: '家电'
    },
    {
      typeid: 3,
      typename: '服装'
    },
    {
      typeid: 4,
      typename: '文具'
    },
      {
      typeid: 5,
      typename: '图书'
    },
    {
      typeid: 6,
      typename: '酒水'
    }
  ]
const imgList = 
  [
    {
    name: 1,
    src: require("../assets/1.jpg"), 
    title:"111"
    },
    {
    name: 2,
    src: require("../assets/2.jpg"), 
    title:"222"
    },
    {
    name: 3,
    src: require("../assets/3.png"), 
    title:"333"
    },
    {
      name: 4,
      src: require("../assets/4.jpg"), 
      title:"444"
    },
    {
      name: 5,
      src: require("../assets/5.jpg"), 
      title:"555"
    }
  ]
</script>
<style scoped>
.coldiv {
  font-size: 11pt;
  color: rgb(125, 123, 123);
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>