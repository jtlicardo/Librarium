<template>
  <v-app-bar
    color="#02afff"
    height="80px"
    clipped-left
    app
    class="d-flex justify-space-between"
  >
    <hamburger-icon @click.native="toggleSidebar"></hamburger-icon>

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
        <v-list-item>
          <v-list-item-title>Account info</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import HamburgerIcon from "./HamburgerIcon.vue"

export default {
  components: {
    HamburgerIcon,
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
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar")
    },
  },
}
</script>

<style>
.v-toolbar__content {
  width: 100%;
  justify-content: space-between;
}
</style>
