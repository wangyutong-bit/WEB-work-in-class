<template>
  <h1>编程式导航及嵌套路由</h1>
  <!--编程式导航-->
  <button @click="go1">前进一步</button>
  <button @click="back1">后退一步</button>
  <button @click="goHome">回首页</button>
  <button @click="goProduct">看产品介绍</button>
  <button @click="repAbout">代替关于我们</button>
  <nav>
    <router-link to="/">首页</router-link> |
    <router-link to="/about">关于我们</router-link> |
    <router-link to="/product">产品介绍</router-link>
  </nav>
  <router-view class="my-view"> </router-view>
</template>
<script>
export default {
  name: 'App',
  methods: {
    go1(){
      this.$router.forward()
    },
    back1(){
      this.$router.back()
    },
    goHome(){
      this.$router.push('/') //字符串路由path
    },
    goProduct(){
      this.$router.push({ //对象
        path: '/product'
      })
    },
    repAbout(){
      this.$router.replace({
       name: 'home', //命名路由
       params:{uname:'123', pwd:'abc'} //传参
      })
    }
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
  }
  nav {
    padding: 30px;
  }
  nav a {
    font-weight: bold;
    color: #2c3e50;
  }
  nav a.router-link-exact-active {
    color: #42b983;
  }
  .my-view {
    width: 500px;
    margin: 0 auto;
    text-indent: 2em;
    text-align: left;
    padding: 5px 10px;
    border: 1px dashed #42b983;
  }
</style>
