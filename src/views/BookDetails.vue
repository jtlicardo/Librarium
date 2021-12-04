<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="8">
        <h1 class="mb-3 text-center">{{ bookTitle }}</h1>
        <h2 class="text-center">by {{ bookAuthor }}</h2>
        <v-img :src="bookLogo" max-width="200px" class="mx-auto mt-10"></v-img>
        <h3 class="mt-14 pt-10 text-center">
          All copies for
          <b>{{ bookTitle }}</b>
        </h3>
        <book-copies class="mt-5 mx-auto" :bookId="id" />
      </v-col>
      <v-col cols="12" md="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookCopies from "@/components/BookCopies.vue"

export default {
  props: ["id"],
  components: {
    BookCopies,
  },
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
    this.selectedBook = this.$store.getters["books/allBooks"].find(
      (book) => book.id === this.id
    )
  },
}
</script>

<style scoped>
h2,
h3 {
  font-weight: 400;
}
</style>
