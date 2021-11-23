<template>
  <v-app>
    <sidebar-nav></sidebar-nav>
    <the-header></the-header>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SidebarNav from "./components/nav/SidebarNav.vue"
import TheHeader from "./components/header/TheHeader.vue"

export default {
  components: {
    SidebarNav,
    TheHeader,
  },
}
</script>
