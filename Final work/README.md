# Music Player

基于 **Vue 3 + Vite + Vue Router** 的本地音乐播放器，支持用户注册登录（localStorage）、歌曲收藏、全屏播放。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

---

## 项目结构

```
Final work/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                    挂载 Vue 实例，注册 router
    ├── App.vue                    根组件，keep-alive + 动态 key
    ├── router/index.js            路由定义 + 导航守卫
    ├── assets/style.css           全局样式
    ├── composables/
    │   ├── useAuth.js             登录/注册/会话 逻辑
    │   └── useFavorites.js        收藏 逻辑
    ├── views/
    │   ├── LoginView.vue          登录/注册页面
    │   ├── PlayerView.vue         播放器页面（包装 MusicPlayer）
    │   └── FavoritesView.vue      收藏列表页面
    └── components/
        ├── MusicPlayer.vue        核心播放器
        ├── PlayerPanel.vue        全屏布局外壳
        ├── PlayerControls.vue     播放控制按钮
        └── TrackList.vue          播放列表（作用域插槽）
```

---

## localStorage 数据模型

| Key | 类型 | 示例 | 说明 |
|---|---|---|---|
| `musicApp_users` | `Array` | `[{id, username, password, favorites}]` | 所有注册用户 |
| `musicApp_session` | `Object` | `{ username: "ninler" }` | 当前登录用户会话 |
| `musicPlayerVolume` | `number` | `0.8` | 播放音量（全局，非按用户） |

### `musicApp_users` 数组元素

```ts
type User = {
  id:        string          // "m9k2x..." 随机生成
  username:  string          // "ninler"
  password:  string          // 明文密码（仅练习项目）
  favorites: FavTrack[]      // 收藏的歌曲列表
}

type FavTrack = {
  id:   string               // 歌曲唯一标识，由 chooseFiles() 生成
  name: string               // 歌曲名（已去后缀）
}
```

### 歌曲 ID 生成规则

```js
// src/components/MusicPlayer.vue — chooseFiles()
id: `${file.name}-${file.lastModified}-${index}`
// 例: "song.mp3-1680000000000-2"
```

同一文件在不同时间选择会生成不同 ID，因此收藏是在当前播放会话内有效的歌曲快照。

---

## 登录注册 — 变量传递链

### 1. LoginView.vue → useAuth composable

```
┌─────────────────┐     调用      ┌──────────────────┐
│  LoginView.vue  │ ────────────→ │  useAuth.js      │
│                 │               │                  │
│  login(u, p)    │               │  setSession()    │
│  register(u, p) │               │  ↓               │
│  error / success│ ←──────────── │  localStorage     │
└─────────────────┘   返回 ref    │  musicApp_session │
                                 └──────────────────┘
```

**LoginView.vue** 中 `useAuth()` 解构出 4 个响应式变量和方法：

```js
const { error, success, login, register } = useAuth()
```

| 变量 | 类型 | 说明 |
|---|---|---|
| `error` | `ref<string>` | 错误提示，空串表示无错误 |
| `success` | `ref<string>` | 成功提示（仅注册时使用） |
| `login(username, password)` | 函数 → `boolean` | 校验用户表，写入 session，返回是否成功 |
| `register(username, password)` | 函数 → `boolean` | 创建新用户，写入 users 表，返回是否成功 |

**login() 执行流程：**

```
login("ninler", "1234")
  │
  ├─ error.value = ''                          // 清空旧错误
  ├─ users = JSON.parse(localStorage["musicApp_users"])
  ├─ user = users.find(u => u.username === "ninler" && u.password === "1234")
  │
  ├─ 找不到 → error.value = '用户名或密码错误。' → return false
  │
  └─ 找到了 → setSession("ninler")
                │
                └─ localStorage["musicApp_session"] = '{"username":"ninler"}'
                return true
```

**register() 执行流程：**

```
register("newuser", "pass")
  │
  ├─ error.value = ''; success.value = ''
  ├─ users = JSON.parse(localStorage["musicApp_users"])
  ├─ 用户名已存在 → error.value = '用户名已存在。' → return false
  │
  └─ 可用 → users.push({ id:随机, username:"newuser", password:"pass", favorites:[] })
           saveUsers(users)
           success.value = '注册成功，请登录。'
           return true
```

**LoginView.vue 的 submit() 使用返回值：**

```js
if (isRegister.value) {
  const ok = register(u, p)          // ok = true/false
  if (ok) {
    isRegister.value = false          // 切换到登录表单
    password.value = ''
    confirmPwd.value = ''
  }
  // 失败时 error.value 已被 useAuth 设置，模板自动渲染
} else {
  if (login(u, p)) {                  // 登录成功
    router.push({ name: 'player' })   // 跳转播放器
  }
  // 失败时 error.value 已被 useAuth 设置
}
```

---

### 2. 路由守卫 — session 校验

`src/router/index.js` 的 `beforeEach` 守卫控制页面访问：

```
用户访问任意路径
  │
  ├─ 目标页 requiresAuth 且无 session
  │     → next({ name: 'login' })     // 重定向到登录
  │
  ├─ 目标页是 /login 且已有 session
  │     → next({ name: 'player' })    // 已登录，直接进播放器
  │
  └─ 其他情况
        → next()                      // 放行
```

`getSession()` 每次从 localStorage 实时读取，不是缓存值。

---

### 3. App.vue — keep-alive 与多用户隔离

```
<router-view v-slot="{ Component }">
  <keep-alive include="PlayerView">
    <component :is="Component" :key="sessionKey" />
  </keep-alive>
</router-view>
```

**sessionKey** 是一个 computed：

```js
const sessionKey = computed(() => {
  const s = getSession()
  return s ? s.username : 'unset'
})
```

| 场景 | sessionKey 值 | 效果 |
|---|---|---|
| 未登录 | `"unset"` | 默认 |
| User A 登录 | `"UserA"` | 创建 PlayerView 实例 |
| User A 浏览收藏再返回 | `"UserA"`（不变） | keep-alive 复用缓存，状态不丢失 |
| User A 退出，User B 登录 | `"UserB"`（变了） | Vue 销毁旧实例，创建新实例，UserB 看到自己的数据 |

**关键**：`:key` 变化时 Vue 会销毁旧的缓存的 PlayerView 并创建全新实例。这防止了用户 A 的 session、播放列表、收藏状态泄漏到用户 B。

---

### 4. MusicPlayer.vue — 播放器如何读取当前用户

```
MusicPlayer.vue setup()
  │
  ├─ getSession()  → { username: "ninler" }
  │
  ├─ username = "ninler"                          // 显示在顶栏
  │
  ├─ useFavorites(tracks)                         // 传入 tracks ref
  │     │
  │     ├─ getSession() → username = "ninler"
  │     ├─ getUsers().find(u => u.username === "ninler")
  │     │     → user.favorites = [{id, name}, ...]
  │     ├─ favMap = new Map([["id1","song1"], ["id2","song2"]])
  │     │
  │     └─ 返回 { toggleFavorite, isFavorited, ... }
  │
  ├─ goFavorites() → router.push({ name:'favorites' })
  ├─ logout()      → clearSession(); router.push({ name:'login' })
  │
  └─ watch(route.query.track)                     // 从收藏页跳回时播放
        │
        └─ 找到对应 track → selectTrack(index)
```

**toggleFavorite 执行流程：**

```
用户点击歌曲旁的 ♡ 按钮
  │
  ├─ toggleFavorite(track)    // track = { id:"xxx", name:"林俊杰 - 交换余生" }
  │     │
  │     ├─ next = new Map(favMap.value)           // 复制当前 Map
  │     ├─ 原来没有 → next.set(track.id, track.name)
  │     ├─ 原来有   → next.delete(track.id)
  │     ├─ favMap.value = next                    // Vue 检测变化，更新 UI
  │     │
  │     └─ saveFavMap()
  │           │
  │           ├─ users = getUsers()
  │           ├─ idx = users.findIndex(u => u.username === currentUsername)
  │           ├─ users[idx].favorites = [...favMap].map(([id,name]) => ({id,name}))
  │           └─ localStorage["musicApp_users"] = JSON.stringify(users)
  │
  └─ 模板中 isFavorited(track) 检查 favMap.has(track.id)
        ♡ (空心) → ♥ (实心红色)  或反之
```

---

### 5. FavoritesView.vue → MusicPlayer 跨页面播放

```
收藏页面点击歌曲 "林俊杰 - 交换余生"
  │
  ├─ playTrack(f)                                  // f = { id:"xxx", name:"..." }
  │     └─ router.push({
  │           name: 'player',
  │           query: { track: "xxx" }              // 通过 URL 传递歌曲 ID
  │        })
  │
  └─ 路由跳转到 /player?track=xxx
        │
        └─ MusicPlayer 中的 watch 触发：
              watch(() => route.query.track, (id) => {
                const idx = tracks.value.findIndex(t => t.id === id)
                if (idx !== -1) selectTrack(idx)    // 找到并播放
              })
```

**局限性**：如果当前播放器中未加载对应音频文件（用户选择了其他本地文件），则不会有任何操作。歌曲 ID 是在 `chooseFiles()` 时生成的，只存在于当前 `tracks` 数组中。

---

### 完整的登录→播放→收藏 数据流（总览）

```
1. 注册
   LoginView.submit()
     → register("user", "pass")
       → users.push({ id, username, password, favorites:[] })
       → localStorage["musicApp_users"] = JSON.stringify(users)
       → return true

2. 登录
   LoginView.submit()
     → login("user", "pass")
       → users.find(...) 校验密码
       → localStorage["musicApp_session"] = '{"username":"user"}'
       → return true
     → router.push({ name:'player' })

3. 路由守卫
   beforeEach(to, from, next)
     → getSession() 读取 localStorage["musicApp_session"]
     → { username:"user" } 存在 → next() 放行

4. App.vue
   sessionKey computed 返回 "user"
   → <component :key="user" /> 渲染 PlayerView
   → keep-alive 缓存此实例

5. 播放器初始化
   MusicPlayer.setup()
     → getSession() → username = "user"
     → useFavorites(tracks) → favMap = 用户的收藏 Map
     → 模板渲染 username + 收藏按钮状态

6. 选择本地音频文件
   chooseFiles(event)
     → tracks.value = [{ id:"song.mp3-...-0", name:"song", url:blob:... }, ...]
     → useFavorites 内的 favoriteTracks computed 自动更新（响应式）

7. 点收藏
   toggleFavorite(track)
     → favMap.set/delete
     → saveFavMap() → users[idx].favorites = [...]
     → localStorage["musicApp_users"] 更新

8. 去收藏页
   goFavorites() → router.push({ name:'favorites' })
     → FavoritesView.onMounted()
       → getFavoriteTracks() 读取 localStorage 返回 [{id,name}, ...]

9. 收藏页点歌曲
   playTrack(f) → router.push({ name:'player', query:{ track:f.id } })
     → MusicPlayer watch(route.query.track) 触发
       → 在 tracks 中查找 → selectTrack() 播放

10. 退出
    logout() → clearSession()
      → localStorage.removeItem("musicApp_session")
      → router.push({ name:'login' })
```

---

## 响应式图

```
localStorage
  │
  ├── musicApp_users ──────┬──→ useAuth.login()          ─→ LoginView.(error|success)
  │                        ├──→ useAuth.register()
  │                        ├──→ useFavorites(tracks)     ─→ MusicPlayer.(isFavorited|toggleFavorite)
  │                        └──→ getFavoriteTracks()      ─→ FavoritesView.favorites
  │
  ├── musicApp_session ────┬──→ router.beforeEach()       ─→ 放行/重定向
  │                        ├──→ App.sessionKey computed   ─→ <component :key />
  │                        ├──→ MusicPlayer.username      ─→ 顶栏显示
  │                        └──→ useFavorites 内部          ─→ 确定读写哪个用户的收藏
  │
  └── musicPlayerVolume ────→ MusicPlayer.volume ref       ─→ <audio>.volume + 双向绑定滑块
```

---

## 快捷命令

```bash
npm run dev       # 开发服务器 (localhost:5173)
npm run build     # 生产构建 (输出到 dist/)
npm run preview   # 预览生产构建
```
