<template>
  <v-app>
    <sidebar-nav v-if="showHeader"></sidebar-nav>
    <transition name="fade" mode="out-in">
      <the-header v-if="showHeader"></the-header>
    </transition>
    <v-main :class="{ authbg: !showHeader }">
      <v-container fluid>
        <transition :name="transitionName" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <base-dialog
      title="Logging you out..."
      color="primary"
      loading
      :active="logoutDialogActive"
    ></base-dialog>
    <v-snackbar content-class="text-center" v-model="snackbarActive" timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
import SidebarNav from "./components/nav/SidebarNav.vue"
import TheHeader from "./components/header/TheHeader.vue"
import BaseDialog from "@/components/ui/BaseDialog.vue"
import { getAuth, onAuthStateChanged } from "@/firebase.js"
import store from "@/store/index.js"

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email
    console.log("Auth state change, user logged in: ", email)
    store.dispatch("setUser", email)
  } else {
    console.log("Auth state change, no user.")
  }
})

export default {
  components: {
    SidebarNav,
    TheHeader,
    BaseDialog,
  },
  data() {
    return {
      transitionName: null,
    }
  },
  computed: {
    showHeader() {
      const curRoute = this.$route.path
      if (curRoute === "/auth") return false
      else return true
    },
    snackbarActive: {
      get: function () {
        return this.$store.getters.snackbarActive
      },
      set: function (newValue) {
        this.$store.dispatch("displaySnackbar", { text: "", isActive: newValue })
      },
    },
    snackbarText() {
      return this.$store.getters.snackbarText
    },
    logoutDialogActive() {
      return this.$store.getters.logoutDialogActive
    },
  },
  watch: {
    $route(to, from) {
      if (from.path === "/auth" || to.path === "/auth") this.transitionName = "quickfade"
      else this.transitionName = "fade"
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

.quickfade-enter-active,
.quickfade-leave-active {
  transition: all 0.1s ease-out;
}

.quickfade-enter,
.quickfade-leave-active {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
