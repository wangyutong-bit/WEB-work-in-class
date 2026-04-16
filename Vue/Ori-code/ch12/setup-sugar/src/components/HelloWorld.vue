<!--以下是【例12-2】的程序-->
<!--
<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
-->
<!--以下是【例12-3】的程序-->
<template>
  <div>
    <h4>接收父组件传值</h4>
    <h4>info：{{ info }}</h4>
    <h4>constv：{{ constv }}</h4>
  </div>
  <div>
    <button @click="add">新增</button>&nbsp;&nbsp;
    <button @click="del">删除</button>
  </div>
  <div>
    <h4>性别：{{prop1}}</h4>
    <h4>其他信息：{{prop2}}</h4>
  </div>
</template>
<script setup>
import {ref, reactive, defineProps, defineEmits, defineExpose } from 'vue'
const prop1 = ref('男')
const prop2 = reactive({
  uname: '陈恒',
  age: 88
})
//使用defineExpose将数据暴露于父组件
defineExpose({
  prop1,
  prop2
})
//接收父组件传值
defineProps({
  info: {
    type: String,
    default: '-----'
  },
  constv: {
    type: String,
    default: '0'
  }
})
//使用defineEmits声明向父组件抛出的自定义事件
const myemits = defineEmits(['myAdd', 'myDel'])
const add = () => {
  //通过抛出myAdd事件向父组件传值
  myemits('myAdd', '传向父组件的新增数据')
}
const del = () => {
  myemits('myDel', '传向父组件的删除数据')
}
</script>
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
