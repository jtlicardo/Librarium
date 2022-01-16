export default {
  displaySnackbar(state, payload) {
    state.snackbar.active = payload.isActive
    state.snackbar.text = payload.text
  },
  displayErrorPopup(state, payload) {
    state.errorPopup.active = payload.isActive
    state.errorPopup.text = payload.text
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
    state.logoutDialog.active = !state.logoutDialog.active
  },
  toggleSidebar(state) {
    state.sidebar.open = !state.sidebar.open
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
