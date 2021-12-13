export default {
  setCurrentUser(context, payload) {
    localStorage.setItem("currentUser", payload)
    context.commit("setCurrentUser", payload)
  },
  tryLogin(context) {
    const user = localStorage.getItem("currentUser")
    if (user) {
      console.log("tryLogin action: found user!")
      context.commit("setCurrentUser", user)
    }
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
  updateFilters(context, payload) {
    context.commit("updateFilters", payload)
  },
  auth(context, payload) {},
}
