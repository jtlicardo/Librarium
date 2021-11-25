export default {
  toggleSidebar(context) {
    context.commit("toggleSidebar")
  },
  setSidebarState(context, payload){
      context.commit("setSidebarState", payload)
  }
}
