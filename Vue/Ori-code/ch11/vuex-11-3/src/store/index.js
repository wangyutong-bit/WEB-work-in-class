import { createStore } from 'vuex'

export default createStore({
  state: {
    BISBN : '9787302598503',
    bookPrice : 99.8,
    bookAuthor : '陈恒',
    bookPress : '清华大学出版社'
  },
  getters: {
    //接受 state 作为其第一个参数
    getBookPrice(state) {
      return state.bookPrice
    },
    //接受其他 getters 作为第二个参数
    getThreeTimesBookPrice(state, getters) {
      return state.bookPrice + getters.getBookPrice * 2
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
