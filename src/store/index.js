import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

import authModule from "@/store/modules/auth/index.js"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: authModule,
  },
  state() {
    return {
      sidebarOpen: false,
      snackbarActive: false,
      snackbarText: "",
      backButton: false,
      backButtonActive: false,
      baseDialog: {
        title: "",
        text: "",
        color: "",
        loading: false,
        active: false,
      },
      errorPopup: {
        errorPopupActive: false,
        errorPopupText: "",
      },
      loadingDialog: {
        active: false,
        title: "",
      },
      searchInput: {
        title: "",
        author: "",
        genre: "",
      },
    }
  },
  mutations,
  actions,
  getters,
})
