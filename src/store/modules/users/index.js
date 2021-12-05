import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

export default {
  namespaced: true,
  state() {
    return {
      users: [
        {
          id: "u1",
          fullname: "Conall Glanville",
          email: "cglanville@gmail.com",
          password: "dsadsada",
          isAdmin: false,
        },
        {
          id: "u2",
          fullname: "Mukami Theodoar",
          email: "mtheodar@gmail.com",
          password: "dsadsada",
          isAdmin: false,
        },
        {
          id: "u3",
          fullname: "Jolie Xenocrates",
          email: "jxenocrates@gmail.com",
          password: "dsadsada",
          isAdmin: false,
        },
      ],
    }
  },
  mutations,
  actions,
  getters,
}
