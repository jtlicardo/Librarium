<template>
  <v-card elevation="2" max-width="50%">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ name }} rated it such and such</v-card-subtitle>
    <v-card-text>{{ comment }}</v-card-text>
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

<style scoped></style>
