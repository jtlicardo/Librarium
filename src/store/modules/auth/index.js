import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

export default {
  state() {
    return {
      currentUser: {
        uid: null,
        fullname: null,
        email: null,
        isAdmin: null,
      },
    }
  },
  mutations,
  actions,
  getters,
}
