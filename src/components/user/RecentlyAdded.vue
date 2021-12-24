<template>
  <div class="mt-5">
    <book-card
      v-for="book in books"
      :key="book.title"
      :title="book.title"
      :author="book.author"
      :imagesource="book.logoUrl"
    ></book-card>
  </div>
</template>

<script>
import { collection, getDocs, db } from "@/firebase.js"
import BookCard from "@/components/user/BookCard.vue"
export default {
  data() {
    return {
      books: [],
    }
  },
  components: {
    BookCard,
  },
  methods: {
    async getBooks() {
      const querySnapshot = await getDocs(collection(db, "books"))
      querySnapshot.forEach((doc) => {
        this.books.push(doc.data())
      })
    },
  },
  async created() {
    await this.getBooks()
  },
}
</script>

<style></style>
