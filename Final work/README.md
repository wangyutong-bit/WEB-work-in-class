# Music Player

基于 **Vue 3 + Vite + Vue Router** 的本地音乐播放器，支持用户注册登录、歌曲收藏、跨页面播放，以及音频文件的 IndexedDB 持久化存储。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173` 。

---

## 项目结构

```
Final work/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                     挂载 Vue 实例，注册 router
    ├── App.vue                     根组件，keep-alive + 动态 key 多用户隔离
    ├── router/index.js             路由定义 + 导航守卫
    ├── assets/style.css            全局样式
    ├── composables/
    │   ├── useAuth.js              登录/注册/会话管理
    │   ├── useFavorites.js         收藏逻辑
    │   └── useTrackStorage.js      IndexedDB 音频文件持久化
    ├── views/
    │   ├── LoginView.vue           登录/注册页面
    │   ├── PlayerView.vue          播放器页面（包装 MusicPlayer）
    │   └── FavoritesView.vue       收藏列表页面
    └── components/
        ├── MusicPlayer.vue         核心播放器
        ├── PlayerPanel.vue         全屏布局外壳
        ├── PlayerControls.vue      播放控制按钮（上/下/播放暂停）
        └── TrackList.vue           播放列表（作用域插槽）
```

---

## 存储架构

### localStorage（持久化用户数据）

| Key | 类型 | 说明 |
|---|---|---|
| `musicApp_users` | `Array<User>` | 所有注册用户及其收藏 |
| `musicApp_session` | `{ username }` | 当前登录会话 |
| `musicPlayerVolume` | `number` (0-1) | 播放音量，默认 0.8 |

#### User 数据模型

```ts
type User = {
  id:        string          // 随机 ID（Date.now().toString(36) + Math.random()）
  username:  string
  password:  string          // 明文（练习项目）
  favorites: FavTrack[]
}

type FavTrack = {
  id:   string               // 歌曲唯一 ID，由 chooseFiles() 生成
  name: string               // 歌曲名（已去除扩展名）
}
```

#### 歌曲 ID 生成规则

```js
// src/components/MusicPlayer.vue — chooseFiles()
// 格式: "文件名.扩展名-lastModified-数组下标"
id: `${file.name}-${file.lastModified}-${i}`
// 例: "交换余生.flac-1718000000000-0"
```

### IndexedDB（持久化音频文件）

| 数据库 | 对象仓库 | Key | 字段 |
|---|---|---|---|
| `musicPlayerDB` v1 | `audioFiles` | `id` (歌曲 ID) | `id`, `name`, `data` (ArrayBuffer), `mime` |

- **写入**: 选择文件时，`saveTracksToDB()` 清除旧数据并写入新文件
- **读取**: 页面加载时，`loadTracksFromDB()` 恢复 ArrayBuffer → `new Blob([data])` → `URL.createObjectURL()` → blob URL
- **生命周期**: blob URL 在组件卸载时释放 (`onBeforeUnmount`)

**为什么需要 IndexedDB**：浏览器刷新后 blob URL 全部失效（`createObjectURL` 只在当前页面生命周期有效）。IndexedDB 将音频文件的二进制数据持久化到磁盘，刷新后自动恢复播放列表，**无需每次重新添加文件**。

---

## 登录注册

### LoginView → useAuth

```
LoginView.vue                    useAuth.js
───────────────────────────────────────────────
login(username, password)  →  getUsers()
                              find 校验
                              setSession() → localStorage["musicApp_session"]
                              return true/false

register(username, password) → getUsers()
                               检查重复
                               users.push({...favorites:[]})
                               saveUsers()
                               return true/false
```

**LoginView** 从 `useAuth()` 解构 4 项：

| 变量 | 类型 | 说明 |
|---|---|---|
| `error` | `ref<string>` | 错误消息 |
| `success` | `ref<string>` | 成功消息（仅注册） |
| `login(u,p)` | `→ boolean` | 校验并写入 session |
| `register(u,p)` | `→ boolean` | 创建用户并写入 users 表 |

### 路由守卫

```js
// router/index.js — beforeEach
beforeEach(to, from, next) {
  // 访问需要登录的页面但无 session → 重定向到 /
  if (to.meta.requiresAuth && !getSession()) → next({ name: 'login' })

  // 已登录却访问 / → 重定向到播放器
  if (to.name === 'login' && getSession())    → next({ name: 'player' })

  // 其他情况放行
  else → next()
}
```

路由表：

| 路径 | 名称 | 组件 | 需登录 |
|---|---|---|---|
| `/` | `login` | LoginView | 否 |
| `/player` | `player` | PlayerView | 是 |
| `/favorites` | `favorites` | FavoritesView | 是 |

### App.vue — keep-alive 与多用户隔离

```html
<router-view v-slot="{ Component }">
  <keep-alive include="PlayerView">
    <component :is="Component" :key="sessionKey" />
  </keep-alive>
</router-view>
```

`sessionKey` = 当前用户名（未登录时 `"unset"`）。

| 场景 | sessionKey 变化 | 效果 |
|---|---|---|
| 用户 A 登录 | `"UserA"` | 新建 PlayerView 实例 |
| 去收藏页再返回 | 不变 | keep-alive 复用缓存，播放状态不丢失 |
| 用户 A 退出，用户 B 登录 | `"UserA"` → `"UserB"` | 销毁旧实例 + 旧 blob URL，创建新实例 |

`:key` 变化时 Vue 销毁旧的 PlayerView，创建全新实例——防止用户间数据泄露。

---

## 音乐播放

### 音频文件加载

```
选择文件（input[type=file] multiple accept=audio/*）
  │
  ├─ chooseFiles(event)
  │     ├─ File → { id, name(去扩展名), url: blobURL }
  │     ├─ saveTracksToDB() → IndexedDB        // 持久化二进制数据
  │     ├─ revoke old blob URLs
  │     ├─ tracks.value = newTracks
  │     ├─ cleanOrphanedFavorites()            // 清理失效收藏
  │     └─ loadCurrentTrack(false)             // 加载但不自动播放

页面刷新 / 重新打开
  │
  ├─ onMounted()
  │     ├─ loadTracksFromDB() → IndexedDB      // 恢复 ArrayBuffer
  │     ├─ new Blob([data]) → createObjectURL  // 重建 blob URL
  │     ├─ tracks.value = restored
  │     └─ playTrackFromQuery()                // 若有 ?track= 则播放
```

### 播放控制

```
<audio ref="audioRef"
  @loadedmetadata → updateDuration()     // 音频元数据就绪后更新总时长
  @时间update       → syncTime()          // 同步 currentTime（拖动时不更新）
  @play/@pause     → isPlaying = true/false
  @ended           → playNext()           // 自动切下一首
/>

togglePlay()  →  audio.paused ? audio.play() : audio.pause()
playPrev()    →  currentIndex = (i - 1 + N) % N  →  loadCurrentTrack(true)
playNext()    →  currentIndex = (i + 1) % N      →  loadCurrentTrack(true)
selectTrack() →  currentIndex = idx              →  loadCurrentTrack(true)
```

`loadCurrentTrack(shouldPlay)` 设置 `audio.src = currentTrack.url`（blob URL）并调用 `audio.play()`。

### 音量

- 默认值 0.8，双向绑定滑块
- `watch(volume)` 同步到 `audio.volume`
- 每次变化写入 `localStorage["musicPlayerVolume"]`

---

## 收藏功能

### 数据结构

```ts
// useFavorites 内部
favMap: ref<Map<string, string>>    // key = trackId, value = trackName(去扩展名)

// localStorage 中的存储格式
user.favorites: [{ id: "song.flac-...", name: "交换余生" }, ...]
```

### 流程

```
点击 ♡ → toggleFavorite(track)
  │
  ├─ next = new Map(favMap.value)
  ├─ 存在 → next.delete(track.id)          // 取消收藏
  ├─ 不存在 → next.set(track.id, trackName) // 添加收藏
  ├─ favMap.value = next                    // 触发响应式更新
  └─ saveFavMap()
        └─ users[idx].favorites = [...favMap].map(([id,name]) => ({id,name}))
           saveUsers() → localStorage["musicApp_users"]
```

所有读写点统一调用 `stripExt()` 去除文件名扩展名，确保收藏列表中名称干净无后缀。

### cleanOrphanedFavorites

当用户更换播放列表（选择新文件）时，自动清理引用已不存在歌曲的收藏项：

```js
// chooseFiles() 末尾调用
const validIds = new Set(tracks.value.map(t => t.id))
// 移除 favMap 中所有 id 不在 validIds 中的条目
```

---

## 跨页面播放：收藏页 → 播放器

这是全文最关键的流程，涉及三个文件的协作。

### 收藏页点击

```js
// FavoritesView.vue
// clickSeq 是模块级变量（不在 setup 内），跨组件挂载持久化
let clickSeq = 0

const playTrack = (f) => {
  router.push({
    name: 'player',
    query: { track: f.id, _seq: String(++clickSeq) }
  })
}
// URL 变为: /player?track=song.flac-1718000000000-0&_seq=1
```

**为什么需要 `_seq`**：Vue Router 的 `watch` 侦听 query 时，同一首歌点击两次 query 值相同，watch 不会触发。`_seq` 确保每次点击 URL 都不同，watch 必然触发。

### 播放器接收

```js
// MusicPlayer.vue
let handledSeq = null    // 已处理的 _seq，防止重复

const playTrackFromQuery = () => {
  const trackId = route.query.track
  if (!trackId) return                          // 无收藏请求

  const seq = route.query._seq || ''
  if (seq === handledSeq) return                // 已处理过，跳过
  handledSeq = seq

  if (!tracks.value.length) {                   // 无歌曲
    if (tracksLoaded.value) showError()
    return
  }

  const idx = tracks.value.findIndex(t => t.id === trackId)
  if (idx === -1) { showError(); return }       // 歌曲不在列表中

  selectTrack(idx)                              // 切歌并播放
}
```

### 触发时机（三条路径全覆盖）

| 场景 | 触发方式 | 说明 |
|---|---|---|
| 初始挂载 + 有 query | `onMounted → nextTick(playTrackFromQuery)` | IndexedDB 恢复后播放 |
| keep-alive 恢复 | `onActivated → nextTick(playTrackFromQuery)` | 从收藏页返回 |
| 组件已活跃 + query 变化 | `watch(route.query._seq) → nextTick(...)` | 在播放器中点击另一首收藏 |

**三重触发+handledSeq 去重的设计**：
- `onActivated` 和 `watch` 可能同时触发 → `handledSeq` 让第二次调用静默跳过
- `onMounted` 和 `watch` 可能同时触发 → 同上
- 每次触发都调 `playTrackFromQuery()`，但只有 `_seq` 不同时才执行播放

### 完整数据流

```
收藏页点击 "交换余生"
  │
  ├─ router.push({ name:'player', query:{ track:"song.flac-...", _seq:"3" }})
  │
  ├─ keep-alive 恢复
  │     └─ onActivated → nextTick → playTrackFromQuery()
  │           handledSeq: null ≠ "3" → 通过
  │           handledSeq = "3"
  │           findIndex("song.flac-...") → 找到 position 2
  │           selectTrack(2) → loadCurrentTrack(true) → audio.play()
  │
  └─ watch(_seq) 也触发
        └─ playTrackFromQuery()
              handledSeq: "3" === "3" → return（去重跳过）
```

---

## 数据流总览

```
┌─────────────────────────────────────────────────────────────┐
│                        localStorage                          │
│  musicApp_users   musicApp_session   musicPlayerVolume       │
└──────┬──────────────────┬───────────────────┬────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
  useAuth            router.beforeEach    MusicPlayer.volume
  useFavorites       App.sessionKey       <audio>.volume
  FavoritesView      MusicPlayer.user     滑块绑定
       │                  │
       ▼                  ▼
  favMap (Map)       <component :key>
  toggleFavorite     keep-alive 缓存
  isFavorited
  cleanOrphanedFavorites

┌─────────────────────────────────────────────────────────────┐
│                       IndexedDB                               │
│  musicPlayerDB / audioFiles                                   │
│  { id, name, data: ArrayBuffer, mime }                       │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
  saveTracksToDB()   ← chooseFiles()
  loadTracksFromDB()  → onMounted() 恢复 tracks
```

---

## 响应式依赖图

```
localStorage["musicApp_users"]
  ├─→ useAuth.login()           → LoginView.error | success
  ├─→ useAuth.register()
  ├─→ useFavorites(tracks)      → MusicPlayer.isFavorited | toggleFavorite
  └─→ getFavoriteTracks()       → FavoritesView.favorites

localStorage["musicApp_session"]
  ├─→ router.beforeEach()       → 放行/重定向
  ├─→ App.sessionKey            → <component :key>
  ├─→ MusicPlayer.username      → 顶栏显示
  └─→ useFavorites 内部          → 确定读写哪个用户的收藏

localStorage["musicPlayerVolume"]
  └─→ MusicPlayer.volume ref    → <audio>.volume + 双向绑定滑块

IndexedDB["musicPlayerDB"]
  ├─→ saveTracksToDB()          ← chooseFiles() 保存
  └─→ loadTracksFromDB()        → onMounted() 恢复 → tracks ref → 播放

route.query._seq
  └─→ watch(_seq)               → playTrackFromQuery() → selectTrack()
route.query.track
  └─→ playTrackFromQuery()      → findIndex → selectTrack()
```

---

## 路由与组件生命周期

```
/ (LoginView)                  ← 未登录自动到此
  │ login() 成功 → push('/player')
  ▼
/player (PlayerView)           ← keep-alive 缓存
  │ MusicPlayer setup()
  │ onMounted → loadTracksFromDB → playTrackFromQuery
  │
  ├─[点收藏] → push('/favorites')
  │   ▼
  │ /favorites (FavoritesView)  ← 每次挂载都重新加载
  │   │ onMounted → getFavoriteTracks()
  │   │
  │   ├─[点歌曲] → push('/player?track=xxx&_seq=N')
  │   │   ▼
  │   │ /player                  ← keep-alive 恢复
  │   │   onActivated → playTrackFromQuery → 播放
  │   │
  │   └─[返回] → push('/player')
  │       ▼
  │       onActivated → playTrackFromQuery（无 query，跳过）
  │
  └─[退出] → clearSession() → push('/')
```

---

## 快捷命令

```bash
npm run dev       # 开发服务器 (localhost:5173)
npm run build     # 生产构建 (dist/)
npm run preview   # 预览生产构建
```
