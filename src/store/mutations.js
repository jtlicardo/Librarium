export default {
  displaySnackbar(state, payload) {
    state.snackbarActive = payload.isActive
    state.snackbarText = payload.text
  },
  displayErrorPopup(state, payload) {
    state.errorPopup.errorPopupActive = payload.isActive
    state.errorPopup.errorPopupText = payload.text
  },
  displayLogoutDialog(state, payload) {
    state.logoutDialogActive = payload
  },
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
