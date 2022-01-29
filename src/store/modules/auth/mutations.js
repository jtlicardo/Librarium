export default {
  setUser(state, payload) {
    state.currentUser.uid = payload.uid
  },
}
