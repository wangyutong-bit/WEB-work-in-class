<template>
    <div>
        <button @click="addBookBy10Vue">执行mutations涨价10元</button>
        <button @click="addBookByNumVue(20)">执行mutations涨价20元</button>
        <button @click="addBookBy10ActionVue">执行action同步涨价10元</button>
        <button @click="addBookBy10">mapMutations涨价10元</button>
        <button @click="addBookBy10ActionAsync">mapActions每秒钟涨价10元</button>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
export default {
    name: 'AddBookPrice',
    methods: {
        addBookBy10Vue() {
            //调用mutations中的addBookBy10
            this.$store.commit('addBookBy10') 
        },
        addBookByNumVue(num) {
            //调用mutations中的addBookByNum
            this.$store.commit('addBookByNum', num) 
        },
        addBookBy10ActionVue() {
            //调用actions中的addBookBy10Action
            this.$store.dispatch('addBookBy10Action') 
        },
        ...mapMutations(
            ['addBookBy10']
        ),
        ...mapActions(
            ['addBookBy10ActionAsync']
        )
    }
}
</script>