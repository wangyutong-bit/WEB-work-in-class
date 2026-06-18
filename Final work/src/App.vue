<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="PlayerView">
      <component :is="Component" :key="sessionKey" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { getSession } from './composables/useAuth'
const sessionKey = computed(() => { const s = getSession(); return s ? s.username : 'unset' })
</script>
