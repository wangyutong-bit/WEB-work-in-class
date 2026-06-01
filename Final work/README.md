# 音乐播放器核心代码说明

这个项目是一个简单的网页版音乐播放器，使用 Vue 3 CDN 编写，不需要安装依赖，直接打开 `First.html` 即可运行。

## 文件结构

```text
Final work/
├── First.html   页面入口，挂载 Vue 应用
├── style.css    页面样式
├── script.js    Vue 组件和播放器逻辑
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

        <template #footer>
            <p class="player-note">Vue components + slots</p>
        </template>
    </music-player>
</div>
```

- `<music-player>`：自定义 Vue 组件
- `#heading`、`#empty`、`#footer`：具名插槽，允许外层页面提供标题、空状态文案和底部说明

## script.js

`script.js` 是播放器的核心逻辑文件，包含 4 个 Vue 组件：

- `PlayerPanel`
- `PlayerControls`
- `TrackList`
- `MusicPlayer`

### 1. PlayerPanel

```js
const PlayerPanel = {
    template: `
        <main class="player">
            <slot name="heading"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </main>
    `
};
```

作用：

- 负责播放器整体布局
- 提供 3 个插槽区域：标题、主体、底部
- 由 `MusicPlayer` 和外层页面一起填充内容

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

变量说明：

- `disabled`：按钮是否应禁用，当没有音频时禁用控制按钮
- `isPlaying`：当前是否正在播放，用于切换按钮文字为 `Play` / `Pause`

函数说明：

- 这个组件没有自己的播放逻辑，仅通过按钮事件通知父组件
- `@click="$emit('prev')"`、`@click="$emit('toggle')"`、`@click="$emit('next')"`

事件说明：

- `prev`：点击“上一首”时发送
- `toggle`：点击“播放/暂停”时发送
- `next`：点击“下一首”时发送

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

变量说明：

- `tracks`：歌曲数组，父组件传入待播放列表
- `currentIndex`：当前播放歌曲下标，用于高亮当前项

函数说明：

- `selectTrack(index)`：点击列表项时触发，向父组件发出 `select` 事件并带上选中下标

模板行为：

- 使用 `v-for` 渲染每一首歌
- 通过作用域插槽 `track` 把 `track`、`index`、`active`、`select` 传给父组件自定义渲染

### 4. MusicPlayer

`MusicPlayer` 是整个播放器的主组件，负责状态管理、音频控制、文件选择和界面交互。

#### data 中的变量

```js
data() {
    return {
        tracks: [],
        currentIndex: 0,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        isPlaying: false
    };
}
```

变量说明：

- `tracks`：已加载的本地音频文件列表
- `currentIndex`：正在播放的歌曲在 `tracks` 中的索引
- `currentTime`：当前播放位置（秒）
- `duration`：当前歌曲总时长（秒）
- `volume`：当前音量，取值范围 `0.0` 到 `1.0`
- `isPlaying`：播放器是否处于播放状态，用于同步按钮显示

#### computed 计算属性

```js
currentTrack() {
    return this.tracks[this.currentIndex] || null;
},
hasTracks() {
    return this.tracks.length > 0;
},
progressMax() {
    return this.duration || 100;
}
```

说明：

- `currentTrack`：返回当前播放的歌曲对象；如果没有歌曲则返回 `null`
- `hasTracks`：判断是否已有音频文件被加载，用于禁用控件
- `progressMax`：播放进度条的最大值，若尚未获取时默认 `100`

#### methods 中的函数

`formatTime(seconds)`

- 作用：把秒数格式化为 `m:ss` 形式
- 参数：`seconds`，传入的时间值
- 返回：如 `0:00`、`1:23`
- 特殊处理：如果不是有限数字则返回 `0:00`

`chooseFiles(event)`

- 作用：读取用户选择的本地音频文件
- 参数：`event`，文件选择输入事件
- 主要逻辑：
  - 释放上一次 `tracks` 里的 `ObjectURL`
  - 将选中的文件转换成 `tracks` 数组，每个元素包含 `id`、`name`、`url`
  - 重置 `currentIndex`、`currentTime`、`duration`、`isPlaying`
  - 调用 `loadCurrentTrack(false)` 载入首个音频但不自动播放

`loadCurrentTrack(shouldPlay)`

- 作用：把当前选中歌曲加载到 `<audio>` 元素
- 参数：`shouldPlay`，是否在加载后立即播放
- 主要逻辑：
  - 获取 `this.$refs.audio`
  - 如果无音频或无当前歌曲则直接返回
  - 设置 `audio.src` 为当前歌曲 `url`
  - 同步 `audio.volume`
  - `audio.load()` 重新加载音频
  - 如果 `shouldPlay` 为 `true`，则调用 `audio.play()`
  - 播放失败时把 `isPlaying` 设为 `false`

`togglePlay()`

- 作用：播放/暂停切换
- 主要逻辑：
  - 若无音频或没有歌曲则返回
  - `audio.paused` 为 `true` 时调用 `audio.play()`
  - 否则调用 `audio.pause()`
  - 捕获播放失败，保持 `isPlaying` 与实际状态一致

`playPrev()`

- 作用：播放上一首
- 逻辑：
  - 如果没有歌曲则返回
  - 计算上一首索引 `(currentIndex - 1 + tracks.length) % tracks.length`
  - 调用 `loadCurrentTrack(true)` 立即播放上一首

`playNext()`

- 作用：播放下一首
- 逻辑：
  - 如果没有歌曲则返回
  - 计算下一首索引 `(currentIndex + 1) % tracks.length`
  - 调用 `loadCurrentTrack(true)` 立即播放下一首

`selectTrack(index)`

- 作用：选择播放列表中的某一首歌
- 参数：`index`，选中的歌曲下标
- 逻辑：更新 `currentIndex` 并调用 `loadCurrentTrack(true)`

`seek()`

- 作用：当用户拖动进度条时跳转播放位置
- 逻辑：
  - 将 `audio.currentTime` 设置为 `currentTime`
  - 只有在已加载歌曲时执行

`setVolume()`

- 作用：调整音量
- 逻辑：
  - 将 `audio.volume` 同步为当前 `volume`

`updateDuration()`

- 作用：当音频元数据加载完成后读取总时长
- 逻辑：
  - 从 `audio.duration` 获取值并向下取整给 `duration`

`syncTime()`

- 作用：实时同步播放进度
- 逻辑：
  - 从 `audio.currentTime` 获取当前时间并向下取整给 `currentTime`

#### 生命周期钩子

`mounted()`

- 作用：组件挂载后立即设置音量

`beforeUnmount()`

- 作用：组件销毁前释放所有 `ObjectURL`
- 逻辑：遍历 `tracks` 并调用 `URL.revokeObjectURL(track.url)`

#### 模板内事件绑定

`<audio ref="audio">` 监听事件：

- `@loadedmetadata="updateDuration"`：音频元数据加载后同步时长
- `@timeupdate="syncTime"`：播放过程中同步当前时间
- `@play="isPlaying = true"`：开始播放时设置状态
- `@pause="isPlaying = false"`：暂停时设置状态
- `@ended="playNext"`：播放结束后自动切换下一首

### 5. 应用挂载

```js
createApp({
    components: {
        MusicPlayer
    }
}).mount("#app");
```

说明：

- 创建 Vue 根实例
- 注册 `MusicPlayer` 组件
- 挂载到页面中的 `#app`

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
