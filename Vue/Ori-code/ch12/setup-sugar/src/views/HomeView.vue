<!--以下是【例12-2】的程序-->
<!--
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
       <h4>uname：{{$route.params.uname}}</h4>
       <h4>pwd：{{$route.params.pwd}}</h4>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>
<script setup>
//组件只需引入不需注册
import HelloWorld from '@/components/HelloWorld.vue'
</script>
-->
<!--以下是【例12-3】的程序-->
<template>
  <div>
    <!-- myAdd和myDel与子组件中使用defineEmits声明向父组件抛出的事件名称相同 -->
    <HelloWorld :info="msg" constv="88" @myAdd="myAddAction" @myDel="myDelAction" ref="comRef"/>
    <button @click="getSon">获取子组件的属性值</button>
  </div>
</template>
<script setup>
//组件只需引入不需注册
import HelloWorld from '@/components/HelloWorld.vue'
import { ref } from 'vue'
const msg = "传给子组件"
//接收子组件传递过来的数据
const myAddAction= (msg) => {
  console.log('单击子组件的新增按钮传值：', msg)
}
//接收子组件传递过来的数据
const myDelAction= (msg) => {
  console.log('单击子组件的删除按钮传值：', msg)
}
const comRef = ref()
//获取子组件的属性值
const getSon = () => {
  console.log('获得子组件中的性别：', comRef.value.prop1)
  console.log('获得子组件中的其他信息：', comRef.value.prop2)
}
</script>
