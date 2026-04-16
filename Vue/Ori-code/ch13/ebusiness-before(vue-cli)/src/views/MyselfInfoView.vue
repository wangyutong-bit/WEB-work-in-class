<template>
  <el-dialog title="个人信息" v-model="dialogVisible" width="35%" @close="goClose()">
    <div class="box">
      <el-form  :model="loginForm" style="width:100%;" label-width="20%">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.uname" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input show-password v-model="loginForm.upwd" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router'
import { reactive} from 'vue'
const router = useRouter()
const route = useRoute() 
const loginForm = reactive({
    uname: sessionStorage.getItem("uname"),
    upwd: 'xxxxxx'
})
let  dialogVisible = true
const goClose = () => {
    //跳转到前一个页面
    let path = route.query.redirect
    router.replace({ path: path === '/' || path === undefined ? '/' : path })
}
</script>
<style scoped>
.box {
  width: 100%;
  height: 100px;
}
</style>