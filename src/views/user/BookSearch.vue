<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5">Search results</h1>
        <filtered-books />
        <p class="mt-15">Can't find the book you're looking for?</p>
        <p>
          <a>Send a request</a>
          to add a book to the library's collection.
        </p>
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

p,
p a {
  color: gray;
}

p a {
  text-decoration: underline;
  font-weight: 500;
}
</style>
