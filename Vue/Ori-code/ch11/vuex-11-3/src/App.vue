<template>
  <div>
    <h3>{{bookName}}</h3>
    <h3>作者：{{$store.state.bookAuthor}}</h3>
    <h3>出版社：{{$store.state.bookPress}}</h3>
    <h3>ISBN：{{$store.state.BISBN}}</h3>
    <h3>价格：{{$store.state.bookPrice}}</h3>
  </div>
  <hr/>
   <div>
    <h3>{{bookName}}</h3>
    <h3>作者：{{bookAuthor}}</h3>
    <h3>出版社：{{bookPress}}</h3>
    <h3>ISBN：{{BISBN}}</h3>
    <h3>价格：{{bookPrice}}</h3>
  </div>
   <hr/>
   <h3>getters访问</h3>
   <h3>一本书花的钱：{{$store.getters.getBookPrice}}</h3>
   <h3>三本书花的钱：{{$store.getters.getThreeTimesBookPrice}}</h3>
   <h3>一本书花的钱：{{getBookPrice}}</h3>
   <h3>三本书花的钱：{{getThreeTimesBookPrice}}</h3>
</template>
<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {//组件中的私有数据
    return {
      bookName : 'SSM + Spring Boot + Vue.js 3全栈开发从入门到实战（微课视频版）'
    }
  },
  //使用计算属性获取store中的状态数据
  computed: {
    bookPress() {
      return this.$store.state.bookPress
    },
    //使用对象展开运算符获取store中的状态数据
    ...mapState(['BISBN', 'bookPrice', 'bookAuthor']),
    ...mapGetters(['getBookPrice', 'getThreeTimesBookPrice'])//混入计算属性
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
