<template>
  <v-app-bar
    color="#02afff"
    height="80px"
    clipped-left
    app
    class="d-flex justify-space-between header"
  >
    <hamburger-icon @click.native="toggleSidebar" v-if="!backButton"></hamburger-icon>
    <back-button
      v-else
      @click.native="removeBackButton"
      @clicked-back="clickedBack"
    ></back-button>

    <v-img
      src="../../assets/logo.png"
      contain
      max-height="40px"
      :max-width="imageWidth"
    ></v-img>

    <v-menu offset-y v-if="menuVisible">
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="white" large class="ml-3 mr-2" v-bind="attrs" v-on="on">
          mdi-account-circle
        </v-icon>
      </template>
      <v-list>
        <v-list-item @click="accountInfo" link>
          <v-list-item-title class="text-center py-2">Account info</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" link>
          <v-list-item-title class="text-center py-2">Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div class="menu-replacement" v-else></div>
  </v-app-bar>
</template>

<script>
import HamburgerIcon from "./HamburgerIcon.vue"
import BackButton from "@/components/header/BackButton.vue"
import { getAuth, signOut } from "firebase/auth"

export default {
  components: {
    HamburgerIcon,
    BackButton,
  },
  data() {
    return {
      menuVisible: true,
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
    currentRoute() {
      return this.$router.currentRoute.path
    },
  },
  watch: {
    $route(to, from) {
      if (to.path === "/auth") this.headerAnimation("hide")
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar")
    },
    removeBackButton() {
      this.$store.dispatch("removeBackButton")
      this.$store.dispatch("removeBackButtonActive")
    },
    headerAnimation(payload) {
      if (payload === "show")
        document.querySelector(".header").classList.remove("hideheader")
      else document.querySelector(".header").classList.add("hideheader")
    },
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    async logout() {
      const auth = getAuth()
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Logging you out...",
      })
      try {
        await signOut(auth)
        console.log("Logout successful!")
        this.$store.dispatch("setUser", {
          uid: null,
          email: null,
          fullname: null,
          isAdmin: null,
        })
        document.querySelector(".header").classList.add("hideheader")
        this.$router.replace("/auth")
        await this.timeout(2000)
        this.$store.dispatch("displaySnackbar", {
          text: "Logout successful!",
          isActive: true,
        })
      } catch (e) {
        console.log("Logout error", e)
      }
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
    },
    accountInfo() {
      const userId = localStorage.getItem("userId")
      this.$router.push({ name: "Account Info", params: { id: userId } })
      this.$store.dispatch("showBackButton")
      this.$store.dispatch("showBackButtonActive")
      this.menuVisible = false
    },
    clickedBack() {
      this.menuVisible = true
    },
  },
  mounted() {
    let userLoggedIn = this.$store.getters.currentUser
    if (userLoggedIn) {
      document.querySelector(".header").classList.add("hidden")
      document.querySelector(".header").classList.add("showheader")
      setTimeout(() => {
        document.querySelector(".header").classList.remove("hidden")
      }, 100)
    }
    // if back button is pressed
    window.onpopstate = (event) => {
      this.$store.dispatch("removeBackButton")
      this.$store.dispatch("removeBackButtonActive")
      this.menuVisible = true
    }
  },
}
</script>

<style>
.v-toolbar__content {
  width: 100%;
  justify-content: space-between;
}

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
  width: 56px;
  height: 36px;
}
</style>
