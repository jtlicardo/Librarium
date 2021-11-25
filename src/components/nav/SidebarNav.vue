<template>
  <v-navigation-drawer
    app
    v-model="sidebarOpen"
    clipped
    disable-resize-watcher
    hide-overlay
    temporary
    :style="{ top: $vuetify.application.top + 'px', zIndex: 4 }"
  >
    <v-list>
      <v-list-item-group active-class="link-active">
        <v-list-item class="justify-center my-2" to="/ubooks">BOOKS</v-list-item>
        <v-list-item class="justify-center my-2" to="/ureservations">
          RESERVATIONS
        </v-list-item>
        <v-list-item class="justify-center my-2" to="/uloans">LOANS</v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    sidebarOpen: {
      get: function () {
        return this.$store.getters.sidebarOpen
      },
      set: function (newValue) {
        this.$store.dispatch("setSidebarState", newValue)
      },
    },
  },
}
</script>

<style scoped>
nav a {
  font-weight: 900;
  font-size: 20px;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #c2c2c2;
}

.link-active {
  color: black;
  background-color: #fddf01;
}

.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
  opacity: 0;
}
</style>
