export default {
  setUser(state, payload) {
    state.currentUser.uid = payload.uid
    state.currentUser.fullname = payload.fullname
    state.currentUser.email = payload.email
    state.currentUser.isAdmin = payload.isAdmin
  },
}
