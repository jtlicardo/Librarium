<template>
  <v-app-bar color="#02afff" height="80px" clipped-left app>
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
