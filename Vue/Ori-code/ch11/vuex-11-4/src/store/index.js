import { createStore } from 'vuex'
export default createStore({
  state: {
    BISBN : '9787302598503',
    bookPrice : 99.8,
    bookAuthor : '陈恒',
    bookPress : '清华大学出版社',
    bookName : 'SSM + Spring Boot + Vue.js 3全栈开发从入门到实战（微课视频版）'
  },
  getts: {

  },
  mutations: {
    addBookBy10(state) {
      state.bookPrice = state.bookPrice + 10
    },
    addBookByNum(state, num) {
      state.bookPrice = state.bookPrice + num
    },
    reduceBookBy10(state) {
      state.bookPrice = state.bookPrice - 10
    },
    reduceBookByNum(state, num) {
      state.bookPrice = state.bookPrice - num
    },
  },
  actions: {
    //同步增加
    addBookBy10Action(context) {
      //执行mutations中的addBookBy10
      context.commit('addBookBy10')
    },
    //同步减少，step为参数
    reduceBookByNumAction(context, step) {
      //执行mutations中的reduceBookByNum
      context.commit('reduceBookByNum', step)
    },
    //异步增加
    addBookBy10ActionAsync(context) {
      setInterval(() => {
        context.commit('addBookBy10')
      }, 1000);
    },
    //异步减少，step为参数
    reduceBookByNumActionAsync(context, step) {
      setInterval(() => {
        context.commit('reduceBookByNum', step)
      }, 1000);
    }
  },
  modules: {
  }
})
