<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5">My reservations</h1>
        <p class="mb-10">A list of all your active reservations.</p>
        <book-reservations-mobile v-if="isMobile" />
        <book-reservations v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookReservationsMobile from "@/components/user/BookReservationsMobile.vue"
import BookReservations from "@/components/user/BookReservations.vue"

export default {
  components: {
    BookReservations,
    BookReservationsMobile,
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
