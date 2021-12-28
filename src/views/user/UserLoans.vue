<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5">My loans</h1>
        <p class="mb-0">A list of all your active loans.</p>
        <p class="mb-10">
          The due date is closing near? Send a request to extend the loan period.
        </p>
        <book-loans-mobile v-if="isMobile" />
        <book-loans v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookLoansMobile from "@/components/user/BookLoansMobile.vue"
import BookLoans from "@/components/user/BookLoans.vue"

export default {
  components: {
    BookLoans,
    BookLoansMobile,
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
