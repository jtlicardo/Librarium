<template>
  <div class="mt-5" v-if="books.length > 0">
    <book-card
      v-for="book in books"
      :key="book.title"
      :title="book.title"
      :author="book.author"
      :imagesource="book.logoUrl"
      @book-title="displayBookDetails"
    ></book-card>
  </div>
</template>

<script>
import { collection, getDocs, db, query, where, orderBy, limit } from "@/firebase.js"
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
      const booksRef = collection(db, "books")
      const q = query(booksRef, orderBy("added_at", "desc"), limit(4))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.books.push(doc.data())
      })
    },
    async displayBookDetails(title) {
      let bookId = ""
      const booksRef = collection(db, "books")
      const q = query(booksRef, where("title", "==", title))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log("Book id: ", doc.id)
        bookId = doc.id
      })
      this.$router.push({ name: "Book Details", params: { id: bookId } })
    },
  },
  async created() {
    await this.getBooks()
  },
}
</script>

<style scoped>
.v-card >>> *:last-child:not(.v-btn):not(.v-chip):not(.v-avatar):not(.v-card__subtitle) {
  transition: all 0.3s ease;
}

.v-card
  >>> *:last-child:not(.v-btn):not(.v-chip):not(.v-avatar):not(.v-card__subtitle):hover {
  color: black;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  cursor: pointer;
}
</style>
