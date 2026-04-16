<template>
  <el-dialog title="用户登录" v-model="dialogVisible" width="35%" @close="goClose()">
    <div class="box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" style="width:100%;" label-width="20%">
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="loginForm.uname" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="upwd">
          <el-input show-password v-model="loginForm.upwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register(loginFormRef)">{{ loadingbuttext }}</el-button>
          <el-button type="danger" @click="cancel(loginFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const route = useRoute() 
const loginFormRef = ref('')
const loginForm = reactive({})
//验证规则
const rules = reactive( {
    uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    upwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度6到20', trigger: 'blur' }
        ],
    reupwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度6到20', trigger: 'blur' }
        ]
    })
let  loadingbuttext = '登录'
let  dialogVisible = true
const   register =  async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
        if(loginForm.uname === 'user888' && loginForm.upwd === 'user888' ){
            ElMessage({message: '登录成功',type: 'success'})
            sessionStorage.setItem("uname", loginForm.uname)
            let path = route.query.redirect
            router.replace({ path: path === '/' || path === undefined ? '/' : path })
        }else {
           ElMessageBox.alert(
            '<span style="color: rgb(249, 7, 7); font-size: 12pt;">用户名或密码错误！</span>',
            '', {dangerouslyUseHTMLString: true}
           )
        }
		
    } else {
      console.log('error submit!', fields)
      ElMessageBox.alert(
        '<span style="color: rgb(249, 7, 7); font-size: 12pt;">表单验证失败！</span>',
        '', {dangerouslyUseHTMLString: true}
      )
    }
  })
}
 const  cancel = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
const goClose = () => {
    router.replace('/')
}
</script>
<style scoped>
.box {
  width: 100%;
  height: 140px;
}
</style>