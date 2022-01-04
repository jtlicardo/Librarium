export default {
  setUser(context, payload) {
    context.commit("setUser", payload)
    if (payload.uid === null) {
      localStorage.removeItem("userId")
      localStorage.removeItem("userFullname")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userIsAdmin")
    } else {
      localStorage.setItem("userId", payload.uid)
      localStorage.setItem("userFullname", payload.fullname)
      localStorage.setItem("userEmail", payload.email)
      localStorage.setItem("userIsAdmin", payload.isAdmin)
    }
  },
}
