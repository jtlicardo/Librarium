<template>
  <div class="text-center">
    <h1 class="mt-16">Page not found</h1>
    <h2>:(</h2>
    <v-btn color="yellow darken-1" class="mt-16" @click="goBack">Go back</v-btn>
    <v-img src="@/assets/notfound.png" max-width="100px" class="notfound"></v-img>
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      const isAdmin = localStorage.getItem("userIsAdmin")
      if (isAdmin === "true") return true
      else return false
    },
  },
  methods: {
    goBack() {
      if (this.isAdmin) this.$router.replace({ name: "Admin Books" })
      else this.$router.replace({ name: "User Books" })
    },
  },
}
</script>

<style scoped>
.notfound {
  position: fixed;
  left: 50%;
  bottom: 20px;
  margin-left: -50px;
}
</style>
