export default {
  snackbarActive(state) {
    return state.snackbar.active
  },
  snackbarText(state) {
    return state.snackbar.text
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
  logoutDialog(state) {
    return state.logoutDialog
  },
  sidebar(state) {
    return state.sidebar
  },
  backButton(state) {
    return state.header.backButton
  },
  backButtonActive(state) {
    return state.header.backButtonActive
  },
  backButtonActiveOnRefresh(state) {
    return state.header.backButtonActiveOnRefresh
  },
  searchInput(state) {
    return state.searchInput
  },
}
