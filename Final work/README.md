# 音乐播放器核心代码说明

这个项目是一个简单的网页版音乐播放器，使用 Vue 3 CDN + Composition API 编写，不需要安装依赖，直接打开 `First.html` 即可运行。

## 文件结构

```text
Final work/
├── First.html   页面入口，挂载 Vue 应用
├── style.css    页面样式
├── script.js    Vue 组件和播放器逻辑（Composition API）
└── README.md    代码说明文档
```

## First.html

`First.html` 负责引入 CSS、Vue 和本地 JS 文件，并把 `MusicPlayer` 组件挂载到 `#app` 上。

主要模板结构：

```html
<div id="app">
    <music-player>
        <template #heading>
            <h1>Music Player</h1>
        </template>

        <template #empty>
            Choose audio files
        </template>
    </music-player>
</div>
```

- `<music-player>`：自定义 Vue 组件
- `#heading`、`#empty`、`#footer`：具名插槽，允许外层页面提供标题、空状态文案和底部说明

## style.css

`style.css` 包含播放器的全部样式，采用纯 CSS 编写，无预处理器依赖。

### 全局重置

```css
* {
    box-sizing: border-box;
}
```

- 所有元素采用 `border-box` 盒模型，`padding` 和 `border` 计入元素总宽高，方便布局计算

### body

```css
body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #fafafa;
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
}
```

- **`margin: 0`** — 去除浏览器默认边距
- **`min-height: 100vh`** — 至少占满视口高度，确保垂直居中生效
- **`display: grid; place-items: center`** — 使用 Grid 居中，等价于 flexbox 的 `justify-content: center; align-items: center`，使播放器卡片在页面正中
- **`background: #fafafa`** — 浅灰背景，衬托白色卡片
- **`color: #333`** — 全局默认文字色，深灰不刺眼
- **`font-family`** — 系统字体栈，优先使用 macOS/iOS/Windows 原生字体
- **`-webkit-font-smoothing: antialiased`** — macOS 下字体更细锐

### .player（卡片容器）

```css
.player {
    width: min(380px, calc(100vw - 48px));
    padding: 32px 28px 24px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
}
```

- **`width: min(380px, calc(100vw - 48px))`** — 宽度取 380px 和视口宽度减 48px 两者中较小的值，大屏固定 380px，小屏留出 24px 边距
- **`padding`** — 内边距上 32px、左右 28px、下 24px，让内容不贴边
- **`background: #fff`** — 白色背景，与页面浅灰形成卡片层次感
- **`border: 1px solid #eee`** — 极淡边框，给卡片一个微弱边界
- **`border-radius: 12px`** — 大圆角，视觉更柔和

### h1（标题）

```css
h1 {
    margin: 0 0 24px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.3px;
    color: #222;
}
```

- **`margin: 0 0 24px`** — 去除默认上下边距，仅保留底部间距
- **`font-size: 18px; font-weight: 500`** — 中等字号字重，不喧宾夺主
- **`letter-spacing: -0.3px`** — 字间距微调，标题更紧凑
- **`color: #222`** — 比正文更深，突出标题层级

### .track-name（当前播放歌曲名）

```css
.track-name {
    min-height: 20px;
    margin: 0 0 20px;
    font-size: 14px;
    font-weight: 400;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.track-name span {
    color: #333;
}
```

- **`min-height: 20px`** — 无歌曲时也占位，防止布局抖动
- **`margin: 0 0 20px`** — 底部留白
- **`color: #888`** — 浅灰占位文字（配合 `#empty` 插槽）
- **`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`** — 歌曲名过长时截断显示省略号
- **`.track-name span`** — 有歌曲时文字显示为深色 `#333`

### .controls（控制按钮行）

```css
.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 20px 0;
}
```

- **`display: flex; justify-content: center`** — 按钮水平居中
- **`align-items: center`** — 垂直居中对齐
- **`gap: 16px`** — 按钮之间间距 16px

### button（通用按钮）

```css
button {
    border: 1px solid #ddd;
    border-radius: 50%;
    background: #fff;
    color: #555;
    cursor: pointer;
    font-size: 13px;
    width: 40px;
    height: 40px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, color 0.15s;
}
button:hover:not(:disabled) {
    border-color: #aaa;
    color: #222;
}
button:disabled {
    cursor: default;
    opacity: 0.25;
}
button:focus-visible {
    outline: 2px solid #999;
    outline-offset: 2px;
}
```

- **`border-radius: 50%; width: 40px; height: 40px`** — 圆形按钮
- **`display: inline-flex; align-items: center; justify-content: center`** — 内部文字（◀ ⏸ ▶）居中
- **`padding: 0`** — 去除默认内边距，宽高完全由 `width/height` 控制
- **`transition: border-color 0.15s, color 0.15s`** — hover 时边框和文字颜色 0.15s 渐变
- **`:hover:not(:disabled)`** — 可用状态下 hover 加深边框和文字色
- **`:disabled`** — 禁用时降低不透明度到 0.25，鼠标变为默认箭头
- **`:focus-visible`** — 键盘聚焦时显示灰色轮廓，提升可访问性

### .play-button（播放/暂停按钮）

```css
.play-button {
    width: 52px;
    height: 52px;
    font-size: 14px;
    font-weight: 500;
    border-color: #ccc;
    color: #333;
}
```

- 比普通按钮更大（52px），字重稍高，视觉上作为主要操作按钮突出

### input[type="range"]（进度条 & 音量条）

```css
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: #eee;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #999;
    border: none;
    cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #999;
    border: none;
    cursor: pointer;
}
input[type="range"]:disabled {
    opacity: 0.25;
    cursor: default;
}
```

- **`appearance: none`** — 移除浏览器默认滑块样式，统一外观
- **`width: 100%; height: 4px`** — 撑满容器宽，4px 细条
- **`background: #eee; border-radius: 2px`** — 浅灰轨道，半圆角
- **`::-webkit-slider-thumb` / `::-moz-range-thumb`** — 自定义滑块：12px 圆形，灰色，无边框
- **`:disabled`** — 无歌曲时降低不透明度

### .time-row（时间显示行）

```css
.time-row {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 11px;
    color: #bbb;
    font-variant-numeric: tabular-nums;
}
```

- **`display: flex; justify-content: space-between`** — 当前时间左对齐，总时长右对齐
- **`font-variant-numeric: tabular-nums`** — 等宽数字，切换歌曲时数字宽度不变，防止布局抖动
- **`color: #bbb; font-size: 11px`** — 浅灰小字，淡化次要信息

### .volume-row（音量控制行）

```css
.volume-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 24px;
    font-size: 12px;
    color: #999;
}
```

- **`display: flex; align-items: center; gap: 10px`** — "Volume" 标签与滑块水平排列，间距 10px
- **`margin-top: 24px`** — 与进度条区域隔开

### input[type="file"]（文件选择器）

```css
input[type="file"] {
    display: block;
    width: 100%;
    margin-bottom: 4px;
    font-size: 13px;
    color: #888;
}
input[type="file"]::file-selector-button {
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    color: #555;
    cursor: pointer;
    font-size: 12px;
    padding: 6px 14px;
    margin-right: 12px;
    transition: border-color 0.15s;
}
input[type="file"]::file-selector-button:hover {
    border-color: #aaa;
}
```

- **`display: block; width: 100%`** — 文件选择器占满容器宽度
- **`::file-selector-button`** — 自定义"选择文件"按钮样式：圆角边框、白色背景、hover 加深边框
- **`margin-right: 12px`** — 按钮与文件名文字之间的间距

### .playlist（歌曲列表）

```css
.playlist {
    margin: 20px 0 0;
    padding: 0;
    list-style: none;
    max-height: 140px;
    overflow: auto;
    border-top: 1px solid #f0f0f0;
}
.playlist li {
    margin: 0;
}
.playlist button {
    width: 100%;
    height: auto;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid #f5f5f5;
    border-radius: 0;
    background: transparent;
    color: #999;
    font-size: 13px;
    text-align: left;
    font-weight: 400;
    transition: color 0.1s;
}
.playlist button:hover {
    color: #555;
}
.playlist button.active {
    color: #333;
    font-weight: 500;
}
```

- **`.playlist`** — 移除默认列表样式，设置最大高度 140px 实现滚动，顶部有细分隔线
- **`.playlist button`** — 列表按钮铺满宽度，无边框、无圆角、左对齐文字，底部有极淡分隔线
- **`.playlist button.active`** — 当前播放的歌曲加粗加深，视觉上高亮

### .error-message（错误提示）

```css
.error-message {
    margin: 0 0 16px;
    padding: 8px 12px;
    background: #fefafa;
    border: 1px solid #f3dfdf;
    border-radius: 6px;
    color: #c44;
    font-size: 13px;
}
```

- **`background: #fefafa; border: 1px solid #f3dfdf`** — 浅红背景 + 淡红边框，暗示错误
- **`color: #c44`** — 红色文字，醒目标识
- **`border-radius: 6px; padding: 8px 12px`** — 内圆角矩形，与卡片风格一致

### .player-note（底部脚注）

```css
.player-note {
    margin: 20px 0 0;
    color: #ccc;
    font-size: 11px;
    text-align: center;
}
```

- 浅灰小字居中，作为卡片最底部的说明文字，淡化处理不干扰主功能

## script.js

`script.js` 是播放器的核心逻辑文件，使用 Vue 3 Composition API，包含 4 个组件：

- `PlayerPanel` — 布局外壳
- `PlayerControls` — 播放控制按钮
- `TrackList` — 歌曲列表
- `MusicPlayer` — 主组件，聚合所有子组件并管理状态

### 1. PlayerPanel

```js
const PlayerPanel = {
    template: `
        <main class="player" role="region" aria-label="Music Player">
            <slot name="heading"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </main>
    `
};
```

作用：

- 最外层的布局容器，提供 `role="region"` 无障碍标识
- 定义三个插槽位置：`heading`（标题）、`default`（主体内容）、`footer`（底部）
- 纯展示组件，不含任何逻辑

### 2. PlayerControls

```js
const PlayerControls = {
    props: {
        disabled: Boolean,
        isPlaying: Boolean
    },
    emits: ["prev", "toggle", "next"],
    template: `...`
};
```

Props 说明：

- **`disabled`**（`Boolean`）— 没有音频文件时禁用所有控制按钮
- **`isPlaying`**（`Boolean`）— 当前播放状态，控制按钮文字显示 ⏸（播放中）或 ▶（暂停中）

Emits 说明：

- **`prev`** — 点击 ◀ 按钮时触发，通知父组件切换到上一首
- **`toggle`** — 点击 ⏸/▶ 按钮时触发，通知父组件切换播放/暂停
- **`next`** — 点击 ▶ 按钮时触发，通知父组件切换到下一首

组件特点：

- 纯展示组件，没有任何播放逻辑，所有操作通过 `$emit` 委托给父组件

### 3. TrackList

```js
const TrackList = {
    props: {
        tracks: { type: Array, required: true },
        currentIndex: { type: Number, required: true }
    },
    emits: ["select"],
    methods: {
        selectTrack(index) {
            this.$emit("select", index);
        }
    },
    template: `...`
};
```

Props 说明：

- **`tracks`**（`Array`）— 歌曲数组，每项包含 `id`、`name`、`url`
- **`currentIndex`**（`Number`）— 当前播放歌曲的索引，用于高亮

Methods 说明：

- **`selectTrack(index)`** — 点击列表项时调用，向父组件发出 `select` 事件并传入选中下标

模板说明：

- 通过 `v-for` 遍历 `tracks` 渲染列表
- 通过作用域插槽 `#track` 将 `track`（歌曲对象）、`index`（下标）、`active`（是否当前播放）、`select`（点击选择函数）暴露给父组件自定义渲染

### 4. MusicPlayer

`MusicPlayer` 是播放器的主组件，采用 Composition API（`setup()`），负责状态管理、音频控制、文件选择和界面交互。

#### setup() 中的响应式变量

```js
const tracks       = ref([]);
const currentIndex = ref(0);
const currentTime  = ref(0);
const duration     = ref(0);
const isPlaying    = ref(false);
const isSeeking    = ref(false);
const errorMessage = ref("");
const audioRef     = ref(null);
const volume       = ref(parseFloat(saved) ?? 0.8);
```

变量说明：

- **`tracks`** — 已加载的本地音频文件数组，每项 `{ id, name, url }`
- **`currentIndex`** — 当前播放歌曲在 `tracks` 中的索引
- **`currentTime`** — 当前播放位置（秒），双向绑定到进度条
- **`duration`** — 当前歌曲总时长（秒），由 `loadedmetadata` 事件填充
- **`isPlaying`** — 播放器是否处于播放状态，控制按钮文字和 `<audio>` 事件同步
- **`isSeeking`** — 用户是否正在拖拽进度条，拖拽期间阻止 `syncTime` 覆盖滑块位置
- **`errorMessage`** — 播放失败时的错误提示文字，空字符串表示无错误
- **`audioRef`** — 模板中 `<audio>` 元素的引用，通过 `ref="audioRef"` 获取
- **`volume`** — 当前音量（0.0 ~ 1.0），初始化时优先从 `localStorage` 恢复，默认 0.8

#### computed 计算属性

```js
const currentTrack = computed(() => tracks.value[currentIndex.value] || null);
const hasTracks    = computed(() => tracks.value.length > 0);
const progressMax  = computed(() => duration.value || 100);
```

说明：

- **`currentTrack`** — 返回当前播放的歌曲对象；`tracks` 为空或下标越界时返回 `null`
- **`hasTracks`** — 判断是否已加载音频文件，用于控制按钮的 `disabled` 状态
- **`progressMax`** — 进度条最大值，通常为 `duration`；若尚未获取时长则默认 `100`

#### 工具函数

**`formatTime(seconds)`**

- 作用：将秒数格式化为 `m:ss` 格式
- 参数：`seconds`（数字）— 要格式化的秒数
- 返回：格式化后的字符串，如 `0:00`、`1:23`、`12:05`
- 边界处理：若非有限数字（`NaN`、`Infinity`）则返回 `"0:00"`

#### 核心播放函数

**`loadCurrentTrack(shouldPlay)`**

- 作用：将当前选中的歌曲加载到 `<audio>` 元素
- 参数：`shouldPlay`（布尔值）— 是否在加载后自动播放
- 执行流程：
  1. 获取 `audioRef.value`，若为空或 `currentTrack` 为 `null` 则直接返回
  2. 将 `audio.src` 设为当前歌曲的 `ObjectURL`
  3. 同步 `audio.volume` 为当前音量值
  4. 调用 `audio.load()` 重新加载音频
  5. 重置 `currentTime` 为 0，清空 `errorMessage`
  6. 若 `shouldPlay` 为 `true`，调用 `audio.play()`，播放失败时设置 `isPlaying = false` 并填充 `errorMessage`

**`chooseFiles(event)`**

- 作用：处理用户通过文件选择器选取的音频文件
- 参数：`event`（InputEvent）— `<input type="file">` 的 `change` 事件
- 执行流程：
  1. 将 `event.target.files` 转为数组，遍历生成 `tracks` 新数组（每项含 `id`、`name`、`url`，其中 `url` 由 `URL.createObjectURL` 生成）
  2. 释放旧 `tracks` 中所有 `ObjectURL`（`URL.revokeObjectURL`），防止内存泄漏
  3. 将新数组赋值给 `tracks`
  4. 重置 `currentIndex`、`currentTime`、`duration`、`isPlaying`、`errorMessage` 为初始值
  5. 通过 `nextTick` 等待 DOM 更新后，调用 `loadCurrentTrack(false)` 加载首首歌但不自动播放

**`togglePlay()`**

- 作用：切换播放/暂停状态
- 执行流程：
  1. 获取 `audioRef.value`，若为空或没有歌曲则直接返回
  2. 若 `audio.paused` 为 `true`，调用 `audio.play()`；否则调用 `audio.pause()`
  3. 播放失败时设置 `isPlaying = false` 并显示错误提示

**`playPrev()`**

- 作用：切换到上一首歌曲并自动播放
- 执行流程：
  1. 若没有歌曲则直接返回
  2. 通过环形取模计算上一首索引：`(currentIndex - 1 + tracks.length) % tracks.length`
  3. 更新 `currentIndex` 后调用 `loadCurrentTrack(true)` 加载并播放

**`playNext()`**

- 作用：切换到下一首歌曲并自动播放（歌曲播放结束时也会自动调用此函数）
- 执行流程：
  1. 若没有歌曲则直接返回
  2. 通过环形取模计算下一首索引：`(currentIndex + 1) % tracks.length`
  3. 更新 `currentIndex` 后调用 `loadCurrentTrack(true)` 加载并播放

**`selectTrack(index)`**

- 作用：选择播放列表中的指定歌曲并立即播放
- 参数：`index`（数字）— 选中的歌曲下标
- 执行流程：更新 `currentIndex` 为目标值，调用 `loadCurrentTrack(true)` 加载并播放

#### 进度拖拽函数

**`onSeekStart()`**

- 作用：用户开始拖拽进度条时调用，设置 `isSeeking = true`
- 目的：阻止 `syncTime` 在拖拽过程中覆盖滑块位置，防止滑块回弹

**`onSeekEnd(event)`**

- 作用：用户结束拖拽进度条时调用，将音频跳转到指定位置
- 参数：`event`（Event）— 进度条 `change` 事件，从 `event.target.value` 获取目标时间
- 执行流程：
  1. 设置 `isSeeking = false`
  2. 若 `audioRef.value` 存在且有歌曲，将 `audio.currentTime` 设为拖拽值

#### 音频事件回调

**`updateDuration()`**

- 作用：音频元数据加载完成后，读取总时长
- 绑定事件：`<audio @loadedmetadata="updateDuration">`
- 执行流程：从 `audio.duration` 获取值，向下取整后赋值给 `duration`

**`syncTime()`**

- 作用：播放过程中实时同步当前播放时间到进度条
- 绑定事件：`<audio @timeupdate="syncTime">`
- 执行流程：
  1. 若 `isSeeking` 为 `true`（正在拖拽），直接返回，不覆盖滑块
  2. 从 `audio.currentTime` 获取当前时间，向下取整后赋值给 `currentTime`

#### watcher 侦听器

**`watch(volume, callback)`**

- 作用：监听音量变化，同步到 `<audio>` 元素和 `localStorage`
- 执行流程：
  1. 每次 `volume` 变化时，将 `audio.volume` 设为新值
  2. 将新值通过 `localStorage.setItem("musicPlayerVolume", val)` 持久化，下次打开页面自动恢复

#### 生命周期钩子

**`onMounted()`**

- 作用：组件挂载后，将 `<audio>` 的音量初始化为当前 `volume`
- 注意：后续音量变更由 `watch(volume, ...)` 自动处理

**`onBeforeUnmount()`**

- 作用：组件销毁前遍历所有 `tracks`，调用 `URL.revokeObjectURL(track.url)` 释放 `ObjectURL`，防止内存泄漏

#### 模板内事件绑定

`<audio ref="audioRef">` 监听事件：

| 事件 | 处理函数 | 说明 |
|---|---|---|
| `@loadedmetadata` | `updateDuration` | 音频元数据加载后获取总时长 |
| `@timeupdate` | `syncTime` | 播放中实时同步当前时间 |
| `@play` | `isPlaying = true` | 播放开始时更新状态 |
| `@pause` | `isPlaying = false` | 暂停时更新状态 |
| `@ended` | `playNext` | 播放结束时自动切到下一首 |

### 5. 应用挂载

```js
createApp({
    components: { MusicPlayer }
}).mount("#app");
```

说明：

- 使用 `createApp` 创建 Vue 根实例
- 注册 `MusicPlayer` 组件
- 挂载到页面中 `#app` 元素上

## 运行方式

直接用浏览器打开：

```text
First.html
```

注意：页面通过 CDN 引入 Vue：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

因此运行时需要联网。
