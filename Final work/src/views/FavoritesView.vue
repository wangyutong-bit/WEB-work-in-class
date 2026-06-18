<script>
// Module scope — persists across FavoritesView remounts (component is NOT cached by keep-alive)
let clickSeq = 0
</script>

<template>
  <div class="centered-page">
  <div class="page-card">
    <div class="back-row">
      <button class="btn-back" @click="$router.push({ name: 'player' })" aria-label="返回">&larr;</button>
      <h1>我的收藏</h1>
    </div>

    <p v-if="!favorites.length" class="empty-hint">
      暂无收藏歌曲。<br>
      <span class="hint-sub">在播放器中点击 ♡ 即可收藏歌曲</span>
    </p>

    <ul v-else class="fav-page-list">
      <li v-for="f in favorites" :key="f.id" class="fav-page-item" @click="playTrack(f)">
        <span class="fav-track-name">{{ f.name }}</span>
        <span class="fav-play-icon">&#9654;</span>
      </li>
    </ul>

    <button class="btn-page-link" @click="$router.push({ name: 'player' })">返回播放器</button>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFavoriteTracks } from '../composables/useFavorites'

const router = useRouter()
const favorites = ref([])

onMounted(() => { favorites.value = getFavoriteTracks() })

const playTrack = (f) => {
  router.push({ name: 'player', query: { track: f.id, _seq: String(++clickSeq) } })
}
</script>
