<template>
  <v-app-bar
    color="#02afff"
    height="80px"
    clipped-left
    app
    class="d-flex justify-space-between"
  >
    <hamburger-icon @click.native="toggleSidebar" v-if="!backButton"></hamburger-icon>
    <back-button v-else @click.native="removeBackButton"></back-button>

    <v-img
      src="../../assets/logo.png"
      contain
      max-height="40px"
      :max-width="imageWidth"
    ></v-img>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-icon color="white" large class="ml-3 mr-2" v-bind="attrs" v-on="on">
          mdi-account-circle
        </v-icon>
      </template>
      <v-list>
        <v-list-item link>
          <v-list-item-title class="text-center py-2">Account info</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" link>
          <v-list-item-title class="text-center py-2">Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar")
    },
    removeBackButton() {
      this.$store.dispatch("removeBackButton")
      this.$store.dispatch("removeBackButtonActive")
    },
    logout() {
      this.$store.dispatch("displayLogoutDialog", true)
      setTimeout(() => {
        const auth = getAuth()
        signOut(auth)
          .then(() => {
            console.log("Logout successful!")
            this.$store.dispatch("displaySnackbar", {
              text: "Logout successful!",
              isActive: true,
            })
            this.$store.dispatch("setUser", {
              uid: null,
              email: null,
              fullname: null,
              isAdmin: null,
            })
            this.$router.replace("/auth")
          })
          .catch((error) => {
            console.log("Logout error!", error)
          })
        this.$store.dispatch("displayLogoutDialog", false)
      }, 1000)
    },
  },
  mounted() {
    // if back button is pressed
    window.onpopstate = (event) => {
      this.$store.dispatch("removeBackButton")
      this.$store.dispatch("removeBackButtonActive")
    }
  },
}
</script>

<style>
.v-toolbar__content {
  width: 100%;
  justify-content: space-between;
}
</style>
