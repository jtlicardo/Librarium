export default {
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
}
