<template>
  <v-app-bar
    color="#02afff"
    height="80px"
    :width="appBarWidth"
    clipped-left
    app
    class="header"
  >
    <hamburger-icon
      @click.native="toggleSidebar"
      v-if="!backButtonActive && !backButton && hamburgerVisible"
    ></hamburger-icon>
    <div
      class="hamburger-replacement"
      v-if="!backButtonActive && !backButton && !hamburgerVisible"
    ></div>
    <back-button v-if="!backButtonActive && backButton"></back-button>
    <back-button-active
      v-if="backButtonActive && !backButton"
      @clicked-back="clickedBackFromActive"
    ></back-button-active>
    <v-spacer></v-spacer>
    <v-img
      src="../../assets/logo.png"
      contain
      max-height="40px"
      :max-width="imageWidth"
    ></v-img>
    <v-spacer></v-spacer>
    <v-icon
      color="white"
      large
      class="ml-3 mr-2 logout"
      @click="openLogoutDialog"
      v-if="menuVisible"
    >
      mdi-logout-variant
    </v-icon>
    <div class="menu-replacement" v-else></div>
  </v-app-bar>
</template>

<script>
import HamburgerIcon from "./HamburgerIcon.vue"
import BackButton from "@/components/header/BackButton.vue"
import BackButtonActive from "@/components/header/BackButtonActive.vue"

export default {
  components: {
    HamburgerIcon,
    BackButton,
    BackButtonActive,
  },
  data() {
    return {
      hamburgerVisible: true,
      menuVisible: true,
      backButtonActive: null,
    }
  },
  computed: {
    imageWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "150px"
        default:
          return "200px"
      }
    },
    backButton() {
      return this.$store.getters.backButton
    },
    appBarWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "100vw"
        default:
          return "100%"
      }
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === "Authentication") this.headerAnimation("hide")
      if (from.name === "Add Loan") this.hamburgerVisible = true
      if (to.name === "Add Loan") this.hamburgerVisible = false
      if (to.meta.backButton || to.meta.hideMenu) this.menuVisible = false
      else {
        this.menuVisible = true
        this.hamburgerVisible = true
      }
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar")
    },
    openLogoutDialog() {
      this.$store.dispatch("toggleLogoutDialog")
    },
    headerAnimation(payload) {
      if (payload === "show")
        document.querySelector(".header").classList.remove("hideheader")
      else document.querySelector(".header").classList.add("hideheader")
    },
    clickedBackFromActive() {
      setTimeout(() => {
        this.backButtonActive = false
      }, 500)
      this.menuVisible = true
    },
    checkIfUserIsLoggedIn() {
      let userLoggedIn = this.$store.getters.currentUser
      if (userLoggedIn) {
        document.querySelector(".header").classList.add("hidden")
        document.querySelector(".header").classList.add("showheader")
        setTimeout(() => {
          document.querySelector(".header").classList.remove("hidden")
        }, 100)
      }
    },
    checkCurrentRoute() {
      if (this.$route.meta.backButton) {
        this.backButtonActive = true
        this.$store.dispatch("backButtonActiveOnRefresh")
        this.menuVisible = false
      }
      if (this.$route.meta.hamburgerVisible === false) {
        this.hamburgerVisible = false
      }
      if (this.$route.meta.hideMenu === true) {
        this.menuVisible = false
      }
    },
  },
  mounted() {
    this.checkIfUserIsLoggedIn()
    this.checkCurrentRoute()
    // if back button is pressed (in browser)
    window.onpopstate = (event) => {
      this.$store.dispatch("removeBackButton")
      this.$store.dispatch("removeBackButtonActive")
      this.menuVisible = true
    }
  },
}
</script>

<style>
.hidden {
  transform: translateY(-100px) !important;
}

.showheader {
  transform: translateY(0px);
  transition: all 0.3s ease-out !important;
}

.hideheader {
  transform: translateY(-100px) !important;
  transition: all 2s ease-out !important;
}

.header {
  transform: translateY(0px);
}

.menu-replacement {
  width: 50px;
  height: 36px;
}

.hamburger-replacement {
  width: 50px;
  height: 50px;
}

button.logout {
  font-size: 30px !important;
}
</style>
