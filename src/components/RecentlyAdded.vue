<template>
  <div class="mt-5">
    <book-card
      v-for="book in books"
      :key="book.id"
      :title="book.title"
      :author="book.author"
      :imagesource="book.logo"
    ></book-card>
  </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue"
export default {
  components: {
    BookCard,
  },
  computed: {
    books() {
      return this.$store.getters["books/allBooks"]
    },
  },
}
</script>

<style></style>
