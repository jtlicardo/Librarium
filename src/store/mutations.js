export default {
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  setSidebarState(state, payload) {
    state.sidebarOpen = payload
  },
  showBackButton(state) {
    state.backButton = true
  },
  showBackButtonActive(state) {
    state.backButtonActive = true
  },
  removeBackButton(state) {
    state.backButton = false
  },
  removeBackButtonActive(state) {
    state.backButtonActive = false
  },
  updateFilters(state, payload) {
    state.searchInput = payload
  },
}
