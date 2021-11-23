<template>
  <v-navigation-drawer
    app
    v-model="isOpen"
    clipped
    disable-resize-watcher
    hide-overlay
    :style="{ top: $vuetify.application.top + 'px', zIndex: 4 }"
  >
    <nav>
      <v-list>
        <v-list-item-group>
          <router-link to="/ubooks"><v-list-item color="yellow">BOOKS</v-list-item></router-link>

          <router-link to="/ureservations">
            <v-list-item color="yellow">RESERVATIONS</v-list-item>
          </router-link>

          <router-link to="/uloans"><v-list-item color="yellow">LOANS</v-list-item></router-link>
        </v-list-item-group>
      </v-list>
    </nav>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    isOpen() {
      return this.$store.state.sidebarOpen
    },
  },
}
</script>

<style scoped>

</style>
