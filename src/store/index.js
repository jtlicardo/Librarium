import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      sidebarOpen: false,
    }
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setIsOpenToFalse(state) {
      if (state.sidebarOpen) state.sidebarOpen = false
    },
  },
  actions: {},
  modules: {},
})
