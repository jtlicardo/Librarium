<template>
  <v-app-bar
    color="#02afff"
    height="80px"
    clipped-left
    app
    class="d-flex justify-space-between"
  >
    <svg
      class="ham ham6"
      viewBox="0 0 100 100"
      width="50"
      :class="{ active: sidebarOpen }"
      id="hamIcon"
      @click="toggleSidebar"
    >
      <path
        class="line top"
        d="m 30,33 h 40 c 13.100415,0 14.380204,31.80258 6.899646,33.421777 -24.612039,5.327373 9.016154,-52.337577 -12.75751,-30.563913 l -28.284272,28.284272"
      />
      <path
        class="line middle"
        d="m 70,50 c 0,0 -32.213436,0 -40,0 -7.786564,0 -6.428571,-4.640244 -6.428571,-8.571429 0,-5.895471 6.073743,-11.783399 12.286435,-5.570707 6.212692,6.212692 28.284272,28.284272 28.284272,28.284272"
      />
      <path
        class="line bottom"
        d="m 69.575405,67.073826 h -40 c -13.100415,0 -14.380204,-31.80258 -6.899646,-33.421777 24.612039,-5.327373 -9.016154,52.337577 12.75751,30.563913 l 28.284272,-28.284272"
      />
    </svg>

    <v-img
      src="../../assets/logo.png"
      contain
      max-height="40px"
      :max-width="imageWidth"
    ></v-img>

    <!-- <p>User icon</p> -->

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
export default {
  methods: {
    toggleSidebar() {
      this.$store.commit("toggleSidebar")
    },
  },
  computed: {
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    },
    imageWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "150px"
        case "sm":
          return "200px"
        case "md":
          return "200px"
        case "lg":
          return "200px"
        case "xl":
          return "200px"
      }
    },
  },
  watch: {
    $route(to, from) {
      let hamIcon = document.querySelector("#hamIcon")
      hamIcon.classList.toggle("active")
      this.$store.state.sidebarOpen = false
    },
  },
}
</script>

<style>
.v-toolbar__content {
  width: 100%;
  justify-content: space-between;
}

.ham {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 400ms;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.line {
  fill: none;
  transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
  stroke: #fff;
  stroke-width: 5.5;
  stroke-linecap: round;
}

.ham6 .top {
  stroke-dasharray: 40 172;
}
.ham6 .middle {
  stroke-dasharray: 40 111;
}
.ham6 .bottom {
  stroke-dasharray: 40 172;
}
.ham6.active .top {
  stroke-dashoffset: -132px;
}
.ham6.active .middle {
  stroke-dashoffset: -71px;
}
.ham6.active .bottom {
  stroke-dashoffset: -132px;
}
</style>
