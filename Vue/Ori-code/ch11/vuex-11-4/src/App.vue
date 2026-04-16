<template>
  <div>
      <h3>书名：{{bookName}}</h3>
      <h3>出版社：{{$store.state.bookPress}}</h3>
      <h3>作者：{{$store.state.bookAuthor}}</h3>
      <h3>原价：{{bookPrice}}</h3>
  </div>
  <hr/>
  <my-add></my-add>
  <hr/>
  <my-reduce></my-reduce>
</template>
<script>
import { mapState } from 'vuex'
import AddBookPrice from './components/AddBookPrice.vue'
import ReduceBookPrice from './components/ReduceBookPrice.vue'
export default {
  name: 'App',
  computed: {
      ...mapState(
      //混入计算属性
      ['bookName','bookPrice']
     )
  },
  components: {//定义子组件
    'my-add': AddBookPrice,
    'my-reduce': ReduceBookPrice
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
