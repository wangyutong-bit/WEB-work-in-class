<template>
  <div class="centered-page">
  <div class="auth-card">
    <h1 class="auth-title">{{ isRegister ? '创建账号' : '登录' }}</h1>

    <p v-if="success" class="auth-msg auth-msg--ok">{{ success }}</p>
    <p v-if="error"   class="auth-msg auth-msg--err">{{ error }}</p>

    <div class="auth-field">
      <input v-model="username" type="text" placeholder="用户名" autocomplete="username" @keyup.enter="submit">
    </div>
    <div class="auth-field">
      <input v-model="password" type="password" placeholder="密码" autocomplete="current-password" @keyup.enter="submit">
    </div>
    <div v-if="isRegister" class="auth-field">
      <input v-model="confirmPwd" type="password" placeholder="确认密码" autocomplete="new-password" @keyup.enter="submit">
    </div>

    <button class="auth-submit" @click="submit">{{ isRegister ? '注册' : '登录' }}</button>

    <p class="auth-switch">
      {{ isRegister ? '已有账号？' : '没有账号？' }}
      <button @click="switchMode">{{ isRegister ? '去登录' : '去注册' }}</button>
    </p>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { error, success, login, register } = useAuth()

const isRegister = ref(false)
const username   = ref('')
const password   = ref('')
const confirmPwd = ref('')

const submit = () => {
  const u = username.value.trim()
  const p = password.value.trim()
  if (!u || !p) { error.value = '请填写所有字段。'; return }
  if (isRegister.value && p !== confirmPwd.value.trim()) { error.value = '两次输入的密码不一致。'; return }
  if (isRegister.value) {
    const ok = register(u, p)
    if (ok) { isRegister.value = false; password.value = ''; confirmPwd.value = '' }
  } else {
    if (login(u, p)) router.push({ name: 'player' })
  }
}

const switchMode = () => { isRegister.value = !isRegister.value; error.value = ''; success.value = '' }
</script>
