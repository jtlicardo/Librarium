<template>
  <!-- <div>
    <p>Book details</p>
    <p>{{ bookTitle }}</p>
  </div> -->
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="8">
        <h1 class="mb-3 text-center">{{ bookTitle }}</h1>
        <h2 class="text-center">by {{ bookAuthor }}</h2>
        <v-img :src="bookLogo" max-width="200px" class="mx-auto mt-10"></v-img>
      </v-col>
      <v-col cols="12" md="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      selectedBook: null,
    }
  },
  computed: {
    bookTitle() {
      return this.selectedBook.title
    },
    bookAuthor() {
      return this.selectedBook.author
    },
    bookLogo() {
      return this.selectedBook.logo
    },
  },
  created() {
    this.selectedBook = this.$store.getters.allBooks.find((book) => book.id === this.id)
  },
}
</script>

<style scoped>
h2 {
  font-weight: 400;
}
</style>
