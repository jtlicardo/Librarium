<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5 d-inline-block">All books</h1>
        <v-btn class="ml-10 mb-4">Filter</v-btn>
        <filtered-books></filtered-books>
        <v-btn class="mt-10" color="yellow darken-1">Add book</v-btn>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilteredBooks from "@/components/FilteredBooks.vue"
export default {
  components: {
    FilteredBooks,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
