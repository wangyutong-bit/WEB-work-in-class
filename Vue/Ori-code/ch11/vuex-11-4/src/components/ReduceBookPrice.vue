<template>
    <div>
        <button @click="reduceBookBy10Vue">执行mutations降价10元</button>
        <button @click="reduceBookByNumVue(20)">执行mutations降价20元</button>
        <button @click="reduceBookByNumActionVue">执行action同步降价10元</button>
        <button @click="reduceBookBy10">mapMutations降价10元</button>
        <button @click="reduceBookByNumActionAsync(20)">mapActions每秒钟降价20元</button>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
export default {
    name: 'ReduceBookPrice',
    methods: {
        reduceBookBy10Vue() {
            //调用mutations中的reduceBookBy10
            this.$store.commit('reduceBookBy10') 
        },
        reduceBookByNumVue(num) {
            //调用mutations中的reduceBookByNum
            this.$store.commit('reduceBookByNum', num) 
        },
        reduceBookByNumActionVue() {
            //调用actions中的reduceBookByNumAction
            this.$store.dispatch('reduceBookByNumAction', 10) 
        },
        ...mapMutations(
            ['reduceBookBy10']
        ),
        ...mapActions(
            ['reduceBookByNumActionAsync']
        )
    }
}
</script>