<template>
  <div>欢迎{{uname}}登录成功</div>
</template>
<script>
export default {
  data () {
    return {
        uname : window.sessionStorage.getItem('user')
    }
  }
}
</script>
