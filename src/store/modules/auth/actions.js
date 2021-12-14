export default {
  setUser(context, payload) {
    context.commit("setUser", payload)
    if (payload === null) {
      localStorage.removeItem("currentUserEmail")
    } else {
      localStorage.setItem("currentUserEmail", payload)
    }
  },
}
