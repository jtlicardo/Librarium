<template>
  <svg
    class="ham hamRotate180 ham5"
    viewBox="0 0 100 100"
    width="50"
    @click="goBack"
    :class="{ active: backButtonActive }"
  >
    <path
      class="line top"
      d="m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429"
    />
    <path class="line middle" d="m 70,50 h -40" />
    <path
      class="line bottom"
      d="m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429"
    />
  </svg>
</template>

<script>
export default {
  emits: ["clicked-back"],
  data() {
    return {
      backButtonActive: true,
    }
  },
  methods: {
    goBack() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      if (userIsAdmin === "true") this.$router.push({ name: "Admin Books" })
      else this.$router.push({ name: "User Books" })
      this.backButtonActive = false
      this.$emit("clicked-back")
    },
  },
  mounted() {
    window.onpopstate = (event) => {
      this.backButtonActive = false
      this.$emit("clicked-back")
    }
  },
}
</script>

<style scoped>
.ham {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 400ms;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.hamRotate180.active {
  transform: rotate(180deg);
}
.line {
  fill: none;
  transition: stroke-dasharray 100ms, stroke-dashoffset 200ms;
  stroke: #fff;
  stroke-width: 5.5;
  stroke-linecap: round;
}
.ham5 .top {
  stroke-dasharray: 40 82;
}
.ham5 .bottom {
  stroke-dasharray: 40 82;
}
.ham5.active .top {
  stroke-dasharray: 14 82;
  stroke-dashoffset: -72px;
}
.ham5.active .bottom {
  stroke-dasharray: 14 82;
  stroke-dashoffset: -72px;
}
</style>
