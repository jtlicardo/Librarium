<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5">My reservations</h1>
        <book-reservations-mobile />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookReservationsMobile from "@/components/BookReservationsMobile.vue"

export default {
  components: {
    BookReservationsMobile,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
