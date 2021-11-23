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
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap");

* {
  font-family: "Zen Kaku Gothic Antique", sans-serif;
}
</style>
