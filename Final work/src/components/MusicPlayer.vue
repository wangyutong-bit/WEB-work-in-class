<template>
  <PlayerPanel>
    <template #heading>
      <div class="top-bar">
        <h1>音乐播放器</h1>
        <div class="top-bar-right">
          <span class="top-bar-user">{{ username }}</span>
          <button class="btn-top" @click="goFavorites">收藏</button>
          <button class="btn-top" @click="logout">退出</button>
        </div>
      </div>
    </template>

    <div class="main-area">
      <div class="player-area">
        <p v-if="currentTrack" class="track-name">{{ currentTrack.name }}</p>
        <p v-else class="track-placeholder">选择音频文件</p>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div class="player-controls-group">
          <PlayerControls
            :disabled="!hasTracks"
            :is-playing="isPlaying"
            @prev="playPrev"
            @toggle="togglePlay"
            @next="playNext"
          />

          <div class="seek-row">
            <input type="range" min="0" :max="progressMax" v-model.number="currentTime"
              :disabled="!hasTracks"
              @mousedown="onSeekStart" @touchstart="onSeekStart"
              @change="onSeekEnd">
            <div class="time-row">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>

        <div class="player-actions">
          <label class="btn-file">
            选择文件
            <input type="file" accept="audio/*" multiple hidden @change="chooseFiles">
          </label>
          <div class="volume-row">
            <span>vol</span>
            <input type="range" min="0" max="1" step="0.01" v-model.number="volume">
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-head">播放列表</div>
        <TrackList :tracks="tracks" :current-index="currentIndex" @select="selectTrack">
          <template #track="{ track, index, active, select }">
            <button type="button" class="track-name-btn" :class="{ active }" @click="select(index)">
              {{ track.name }}
            </button>
            <button type="button" class="fav-btn" :class="{ on: isFavorited(track) }"
              @click.stop="toggleFavorite(track)"
              :aria-label="isFavorited(track) ? '取消收藏' : '添加收藏'"
            >{{ isFavorited(track) ? '&#x2665;' : '&#x2661;' }}</button>
          </template>
        </TrackList>
      </div>
    </div>

    <audio ref="audioRef"
      @loadedmetadata="updateDuration" @timeupdate="syncTime"
      @play="isPlaying = true" @pause="isPlaying = false"
      @ended="playNext"
    />
  </PlayerPanel>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PlayerPanel from './PlayerPanel.vue'
import PlayerControls from './PlayerControls.vue'
import TrackList from './TrackList.vue'
import { getSession, clearSession } from '../composables/useAuth'
import { useFavorites } from '../composables/useFavorites'

const router = useRouter()
const route  = useRoute()
const session  = getSession()
const username = session ? session.username : ''

const tracks       = ref([])
const currentIndex = ref(0)
const currentTime  = ref(0)
const duration     = ref(0)
const isPlaying    = ref(false)
const isSeeking    = ref(false)
const errorMessage = ref('')
const audioRef     = ref(null)

const storageOk = typeof localStorage !== 'undefined'
const saved     = storageOk ? localStorage.getItem('musicPlayerVolume') : null
const volume    = ref(saved !== null ? parseFloat(saved) : 0.8)

const currentTrack = computed(() => tracks.value[currentIndex.value] || null)
const hasTracks    = computed(() => tracks.value.length > 0)
const progressMax  = computed(() => duration.value || 100)

const { toggleFavorite, isFavorited } = useFavorites(tracks)

const goFavorites = () => router.push({ name: 'favorites' })
const logout = () => { clearSession(); router.push({ name: 'login' }) }

watch(() => route.query.track, (id) => {
  if (id && tracks.value.length) {
    const idx = tracks.value.findIndex(t => t.id === id)
    if (idx !== -1) selectTrack(idx)
  }
})

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = String(Math.floor(seconds % 60)).padStart(2, '0')
  return `${m}:${s}`
}

const loadCurrentTrack = (shouldPlay) => {
  const audio = audioRef.value
  if (!audio || !currentTrack.value) return
  audio.src = currentTrack.value.url
  audio.volume = volume.value
  audio.load()
  currentTime.value = 0
  errorMessage.value = ''
  if (shouldPlay) {
    audio.play().catch((err) => {
      console.warn('播放失败:', err)
      isPlaying.value = false
      errorMessage.value = '无法播放该曲目'
    })
  }
}

const chooseFiles = (event) => {
  const files = Array.from(event.target.files)
  const newTracks = files.map((file, i) => ({
    id: `${file.name}-${file.lastModified}-${i}`,
    name: file.name.replace(/\.[^.]*$/, ''),
    url: URL.createObjectURL(file)
  }))
  tracks.value.forEach(t => URL.revokeObjectURL(t.url))
  tracks.value = newTracks
  currentIndex.value = 0
  currentTime.value = duration.value = 0
  isPlaying.value = false
  errorMessage.value = ''
  nextTick(() => loadCurrentTrack(false))
}

const togglePlay = () => {
  const audio = audioRef.value
  if (!audio || !hasTracks.value) return
  if (audio.paused) {
    audio.play().catch((err) => { console.warn('播放失败:', err); isPlaying.value = false; errorMessage.value = '无法播放' })
  } else {
    audio.pause()
  }
}

const playPrev = () => {
  if (!hasTracks.value) return
  currentIndex.value = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
  loadCurrentTrack(true)
}

const playNext = () => {
  if (!hasTracks.value) return
  currentIndex.value = (currentIndex.value + 1) % tracks.value.length
  loadCurrentTrack(true)
}

const selectTrack = (index) => { currentIndex.value = index; loadCurrentTrack(true) }
const onSeekStart = () => { isSeeking.value = true }
const onSeekEnd = (event) => {
  isSeeking.value = false
  const audio = audioRef.value
  if (audio && hasTracks.value) audio.currentTime = Number(event.target.value)
}
const updateDuration = () => { const a = audioRef.value; duration.value = a ? Math.floor(a.duration) : 0 }
const syncTime = () => { if (isSeeking.value) return; const a = audioRef.value; currentTime.value = a ? Math.floor(a.currentTime) : 0 }

watch(volume, (val) => {
  const audio = audioRef.value
  if (audio) audio.volume = val
  if (storageOk) localStorage.setItem('musicPlayerVolume', val)
})

onMounted(() => { const a = audioRef.value; if (a) a.volume = volume.value })
onBeforeUnmount(() => { tracks.value.forEach(t => URL.revokeObjectURL(t.url)) })
</script>
