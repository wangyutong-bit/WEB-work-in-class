<template>
  <div class="proudect">
    <h1>This is the proudect page</h1>
    <h2>Hello Word</h2>
    <router-link to="/proudects/js">js书</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'proudectsView'
}
</script>
