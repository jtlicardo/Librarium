import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

import booksModule from "@/store/modules/books/index.js"
import usersModule from "@/store/modules/users/index.js"
import authModule from "@/store/modules/auth/index.js"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    books: booksModule,
    users: usersModule,
    auth: authModule,
  },
  state() {
    return {
      sidebarOpen: false,
      snackbarActive: false,
      snackbarText: "",
      logoutDialogActive: false,
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
