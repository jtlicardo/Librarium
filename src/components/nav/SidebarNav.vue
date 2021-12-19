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
      <v-list-item-group v-if="sidebarLinks === 'user'" active-class="link-active">
        <v-list-item
          class="justify-center my-2"
          v-for="item in userListItems"
          :key="item.to"
          :to="item.to"
        >
          {{ item.text }}
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group v-if="sidebarLinks === 'admin'" active-class="link-active">
        <v-list-item
          class="justify-center my-2"
          v-for="item in adminListItems"
          :key="item.to"
          :to="item.to"
        >
          {{ item.text }}
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      userListItems: [
        { text: "BOOKS", to: "/ubooks" },
        { text: "RESERVATIONS", to: "/ureservations" },
        { text: "LOANS", to: "/uloans" },
      ],
      adminListItems: [
        { text: "BOOKS", to: "/adminbooks" },
        { text: "LOANS", to: "/adminloans" },
        { text: "RESERVATIONS", to: "/adminreservations" },
        { text: "REQUESTS", to: "/adminrequests" },
        { text: "USERS", to: "/adminusers" },
      ],
    }
  },
  computed: {
    sidebarOpen: {
      get: function () {
        return this.$store.getters.sidebarOpen
      },
      set: function (newValue) {
        this.$store.dispatch("setSidebarState", newValue)
      },
    },
    sidebarLinks() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      if (userIsAdmin === "true") return "admin"
      else return "user"
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
