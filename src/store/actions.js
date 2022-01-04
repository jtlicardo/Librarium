export default {
  displaySnackbar(context, payload) {
    context.commit("displaySnackbar", payload)
  },
  displayErrorPopup(context, payload) {
    context.commit("displayErrorPopup", payload)
  },
  displayBaseDialog(context, payload) {
    context.commit("displayBaseDialog", payload)
  },
  displayLoadingDialog(context, payload) {
    context.commit("displayLoadingDialog", payload)
  },
  toggleSidebar(context) {
    context.commit("toggleSidebar")
  },
  setSidebarState(context, payload) {
    context.commit("setSidebarState", payload)
  },
  showBackButton(context) {
    context.commit("showBackButton")
  },
  showBackButtonActive(context) {
    setTimeout(() => {
      context.commit("showBackButtonActive")
    }, 100)
  },
  removeBackButton(context) {
    setTimeout(() => {
      context.commit("removeBackButton")
    }, 300)
  },
  removeBackButtonActive(context) {
    context.commit("removeBackButtonActive")
  },
  backButtonActiveOnRefresh(context){
    context.commit("backButtonActiveOnRefresh")
  },
  updateFilters(context, payload) {
    context.commit("updateFilters", payload)
  },
}
