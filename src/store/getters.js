export default {
  snackbarActive(state) {
    return state.snackbarActive
  },
  snackbarText(state) {
    return state.snackbarText
  },
  errorPopup(state) {
    return state.errorPopup
  },
  baseDialog(state) {
    return state.baseDialog
  },
  loadingDialog(state) {
    return state.loadingDialog
  },
  sidebarOpen(state) {
    return state.sidebarOpen
  },
  backButton(state) {
    return state.header.backButton
  },
  backButtonActive(state) {
    return state.header.backButtonActive
  },
  hamburgerVisible(state) {
    return state.header.hamburgerVisible
  },
  searchInput(state) {
    return state.searchInput
  },
}
