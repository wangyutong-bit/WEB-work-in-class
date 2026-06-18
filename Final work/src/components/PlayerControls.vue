<template>
  <div class="controls">
    <button type="button" class="ctrl-btn" :disabled="disabled" @click="$emit('prev')" aria-label="上一首">&#x25C0;</button>
    <button type="button" class="ctrl-btn ctrl-btn-play" :disabled="disabled" @click="$emit('toggle')" :aria-label="isPlaying ? '暂停' : '播放'">
      {{ isPlaying ? '&#x25A0;' : '&#x25B6;' }}
    </button>
    <button type="button" class="ctrl-btn" :disabled="disabled" @click="$emit('next')" aria-label="下一首">&#x25B6;</button>
  </div>
</template>

<script setup>
defineProps({ disabled: Boolean, isPlaying: Boolean })
defineEmits(['prev', 'toggle', 'next'])
</script>
