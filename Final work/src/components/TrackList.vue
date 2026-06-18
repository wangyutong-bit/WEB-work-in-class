<template>
  <ul class="sidebar-list" v-if="tracks.length" role="listbox" aria-label="播放列表">
    <li v-for="(track, index) in tracks" :key="track.id" class="track-item" role="option" :aria-selected="index === currentIndex">
      <span class="track-num">{{ String(index + 1).padStart(2, '0') }}</span>
      <slot name="track" :track="track" :index="index" :active="index === currentIndex" :select="selectTrack">
        <button type="button" class="track-name-btn" :class="{ active: index === currentIndex }" @click="selectTrack(index)">
          {{ track.name }}
        </button>
      </slot>
    </li>
  </ul>
  <div v-else class="sidebar-empty">暂无歌曲</div>
</template>

<script setup>
defineProps({ tracks: { type: Array, required: true }, currentIndex: { type: Number, required: true } })
const emit = defineEmits(['select'])
function selectTrack(index) { emit('select', index) }
</script>
