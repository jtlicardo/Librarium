export default {
  displaySnackbar(state, payload) {
    state.snackbarActive = payload.isActive
    state.snackbarText = payload.text
  },
  displayErrorPopup(state, payload) {
    state.errorPopup.errorPopupActive = payload.isActive
    state.errorPopup.errorPopupText = payload.text
  },
  displayBaseDialog(state, payload) {
    state.baseDialog.title = payload.title
    state.baseDialog.text = payload.text
    state.baseDialog.color = payload.color
    state.baseDialog.loading = payload.loading
    state.baseDialog.active = payload.active
  },
  displayLoadingDialog(state, payload) {
    state.loadingDialog.active = payload.active
    state.loadingDialog.title = payload.title
  },
  toggleLogoutDialog(state) {
    state.logoutDialogActive = !state.logoutDialogActive
  },
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  setSidebarState(state, payload) {
    state.sidebarOpen = payload
  },
  showBackButton(state) {
    state.header.backButton = true
  },
  showBackButtonActive(state) {
    state.header.backButtonActive = true
  },
  removeBackButton(state) {
    state.header.backButton = false
  },
  removeBackButtonActive(state) {
    state.header.backButtonActive = false
  },
  backButtonActiveOnRefresh(state) {
    state.header.backButtonActiveOnRefresh = true
  },
  updateFilters(state, payload) {
    state.searchInput = payload
  },
}
