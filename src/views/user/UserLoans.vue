<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1" xl="2"></v-col>
      <v-col cols="12" md="10" xl="8">
        <h1 class="mb-5">My loans</h1>
        <p class="mb-0">A list of all your active loans.</p>
        <p class="mb-10">
          The due date is closing near? Send a request to extend the loan period.
        </p>
        <book-loans />
      </v-col>
      <v-col cols="12" md="1" xl="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookLoans from "@/components/user/BookLoans.vue"

export default {
  components: {
    BookLoans,
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
