<template>
  <div>
    <h2>登录页面</h2>
    <form>
    用户名:<input type="text" v-model="uname" placeholder="请输入用户名"/><br><br>
    密码： <input type="password" v-model="upwd" placeholder="请输入密码"/><br><br>
    <button type="button" @click="login"  :disabled="isDisable">登录</button>
    <button type="reset">重置</button>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
        isDisable:false,
        uname: '',
        upwd: ''
    }
  },
  methods: {
       login () {
           this.isDisable = true
            if (this.uname === 'zhangsan' && this.upwd == '123456') {
                alert('登录成功')
                window.sessionStorage.setItem('user', this.uname)
                //到达成功之后的页面
                let path = this.$route.query.redirect
                this.$router.replace({path: path === '/' || path === undefined ? '/main': path})
            }else {
                alert("用户名或密码错误！")
                this.isDisable = false
            }
       }
  }
}
</script>
