<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-10">All reservations</h1>
        <book-reservations />
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookReservations from "@/components/admin/BookReservations.vue"
export default {
  components: {
    BookReservations,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
