<template>
  <div class="centered-page">
  <div class="page-card">
    <div class="back-row">
      <button class="btn-back" @click="$router.push({ name: 'player' })" aria-label="返回">&larr;</button>
      <h1>我的收藏</h1>
    </div>

    <p v-if="!favorites.length" class="empty-hint">暂无收藏歌曲</p>

    <ul v-else class="fav-page-list">
      <li v-for="f in favorites" :key="f.id" class="fav-page-item" @click="playTrack(f)">{{ f.name }}</li>
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
  router.push({ name: 'player', query: { track: f.id } })
}
</script>
