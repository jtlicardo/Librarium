export default {
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  setSidebarState(state, payload) {
      state.sidebarOpen = payload
  }
}
