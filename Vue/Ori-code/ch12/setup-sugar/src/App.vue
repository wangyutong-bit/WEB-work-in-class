<!--以下是【例12-1】的代码-->
<!--<template>
  <div>firstNumber不是一个响应式且可改变的基本数据：{{firstNumber}}</div>
  <div>sencondNumber是一个响应式且可改变的基本数据：{{sencondNumber}}</div>
  <div>thirdNumber是一个响应式且可改变的对象数据：{{thirdNumber}}</div>
  <div><button @click="changeNumber">改变数据</button></div>
</template>
<script setup>
//只需添加setup属性，与setup函数一样，使用setup语法糖时没有this
import { ref,reactive } from 'vue'
//不使用ref定义的变量
let firstNumber = 100
//使用ref定义的变量，是一个响应式且可改变的基本数据对象
let sencondNumber = ref(100)
//使用reactive定义的变量，是一个响应式且可改变的对象
let thirdNumber = reactive({
  uname: '陈恒',
  age: '58'
})
//定义一个无参数的方法，使用setup语法糖时，方法也被认为属性
let changeNumber = ()=> {
  firstNumber++
  //在模板中使用时，它会自动开箱，无需在模板内额外书写.value
  sencondNumber.value++
  thirdNumber.age++
}
</script>
-->
<!--以下是【例12-2】的代码-->
<template>
  <div><button @click="goToNewPage">去Vue主页home</button></div>
  <router-view/>
</template>
<script setup>
// 记住是在vue-router中引入useRouter
import {useRouter} from 'vue-router'
const router = useRouter()
let goToNewPage = ()=>{
  router.push({name: 'home', params:{uname:'123', pwd:'abc'} })
}
</script>
