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
          v-for="(item, index) in userListItems"
          :key="index"
          :to="item.to"
        >
          {{ item.text }}
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group v-if="sidebarLinks === 'admin'" active-class="link-active">
        <v-list-item
          class="justify-center my-2"
          v-for="(item, index) in adminListItems"
          :key="index"
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
        { text: "BOOKS", to: { name: "User Books" } },
        { text: "RESERVATIONS", to: { name: "User Reservations" } },
        { text: "LOANS", to: { name: "User Loans" } },
        { text: "ACCOUNT", to: `/account/${localStorage.getItem("userId")}` },
      ],
      adminListItems: [
        { text: "BOOKS", to: { name: "Admin Books" } },
        { text: "LOANS", to: { name: "Admin Loans" } },
        { text: "RESERVATIONS", to: { name: "Admin Reservations" } },
        { text: "REQUESTS", to: { name: "Admin Requests" } },
        { text: "USERS", to: { name: "Admin Users" } },
        { text: "ACCOUNT", to: `/account/${localStorage.getItem("userId")}` },
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
