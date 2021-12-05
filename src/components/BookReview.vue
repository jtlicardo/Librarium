<template>
  <v-card elevation="2" max-width="45%" class="mx-2 my-2">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>
      <b>{{ name }}</b>
      rated it such and such
    </v-card-subtitle>
    <v-card-text class="black--text">{{ comment }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["title", "userId", "comment"],
  data() {
    return {
      selectedUser: null,
    }
  },
  computed: {
    name() {
      return this.selectedUser.fullname
    },
  },
  created() {
    this.selectedUser = this.$store.getters["users/allUsers"].find(
      (user) => user.id === this.userId
    )
  },
}
</script>

<style scoped>
.v-card {
  display: inline-block;
}
</style>
