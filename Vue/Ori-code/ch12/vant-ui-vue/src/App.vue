<template>
<van-cell title="选择日期区间" :value="date" @click="show = true" />
<van-calendar v-model:show="show" type="range" @confirm="onConfirm" />
</template> 
<script setup>
import { ref } from 'vue'
const date = ref('')
const show = ref(false)
const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`
const onConfirm = (values) => {
  const [start, end] = values
  show.value = false
  date.value = `${formatDate(start)} - ${formatDate(end)}`
}
</script>