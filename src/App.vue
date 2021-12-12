<template>
  <v-app>
    <sidebar-nav v-if="showHeader"></sidebar-nav>
    <the-header v-if="showHeader"></the-header>
    <v-main :class="{ authbg: !showHeader }">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SidebarNav from "./components/nav/SidebarNav.vue"
import TheHeader from "./components/header/TheHeader.vue"
import { getAuth, onAuthStateChanged } from "@/firebase.js"
import store from "@/store/index.js"

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email
    console.log("Auth state change, user logged in: ", email)
    store.dispatch("setCurrentUser", email)
  } else {
    console.log("Auth state change, no user.")
    store.dispatch("setCurrentUser", null)
  }
})

export default {
  components: {
    SidebarNav,
    TheHeader,
  },
  computed: {
    showHeader() {
      const curRoute = this.$route.path
      if (curRoute === "/auth") return false
      else return true
    },
  },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+Antique:wght@300;400;500;700;900&display=swap");

* {
  font-family: "Zen Kaku Gothic Antique", sans-serif;
}

.authbg {
  background-image: url("./assets/authbackground.jpg");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
