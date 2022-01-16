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
      sidebar: {
        open: false,
      },
      snackbar: {
        active: false,
        text: "",
      },
      header: {
        backButton: false,
        backButtonActive: false,
        backButtonActiveOnRefresh: false,
      },
      baseDialog: {
        title: "",
        text: "",
        color: "",
        loading: false,
        active: false,
      },
      errorPopup: {
        active: false,
        text: "",
      },
      loadingDialog: {
        active: false,
        title: "",
      },
      logoutDialog: {
        active: false,
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
