import { ref } from 'vue'

function getUsers() {
  try { const raw = localStorage.getItem('musicApp_users'); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem('musicApp_users', JSON.stringify(users))
}

function setSession(username) {
  localStorage.setItem('musicApp_session', JSON.stringify({ username }))
}

export function clearSession() {
  localStorage.removeItem('musicApp_session')
}

export function getSession() {
  try { const raw = localStorage.getItem('musicApp_session'); return raw ? JSON.parse(raw) : null }
  catch { return null }
}

export function useAuth() {
  const error = ref('')
  const success = ref('')

  const login = (username, password) => {
    error.value = ''
    const users = getUsers()
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
      error.value = '用户名或密码错误。'
      return false
    }
    setSession(username)
    return true
  }

  const register = (username, password) => {
    error.value = ''
    success.value = ''
    const users = getUsers()
    if (users.find(u => u.username === username)) {
      error.value = '用户名已存在。'
      return false
    }
    users.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      username,
      password,
      favorites: []
    })
    saveUsers(users)
    success.value = '注册成功，请登录。'
    return true
  }

  return { error, success, login, register }
}
