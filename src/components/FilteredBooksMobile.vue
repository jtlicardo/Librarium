<template>
  <div class="text-center">
    <mobile-search-card
      v-for="(book, index) in books"
      :key="index"
      :title="book.title"
      :author="book.author"
      :imagesource="book.logoUrl"
      :genres="book.genres"
      :reviews="book.reviews"
      :copies="book.copies"
      :added="book.added_at"
      @book-title="displayBookDetails"
      @delete="openDialog"
      class="mx-auto"
    ></mobile-search-card>
    <p v-if="books.length === 0 && !loading">No books found</p>
    <delete-book
      :active="dialogActive"
      :book="bookToBeDeleted"
      @close-dialog="closeDialog"
      @deleted="getAllBooks"
    ></delete-book>
  </div>
</template>

<script>
import MobileSearchCard from "@/components/MobileSearchCard.vue"
import DeleteBook from "@/components/admin/DeleteBook.vue"

import { collection, getDocs, db, query, where } from "@/firebase.js"

export default {
  props: {
    searchtitle: {
      type: String,
      required: false,
    },
    searchauthor: {
      type: String,
      required: false,
    },
    searchgenre: {
      type: String,
      required: false,
    },
  },
  components: {
    MobileSearchCard,
    DeleteBook,
  },
  data() {
    return {
      books: [],
      search: "",
      loading: false,
      bookToBeDeleted: null,
      dialogActive: false,
    }
  },
  computed: {
    backButtonActiveOnRefresh() {
      return this.$store.getters.backButtonActiveOnRefresh
    },
  },
  methods: {
    calculateAvgRating(reviews) {
      if (reviews.length === 0) return "N/A"
      let total = 0
      for (let review of reviews) {
        total += review.rating
      }
      return (total / reviews.length).toFixed(1)
    },
    async getAllBooks() {
      this.loading = true
      this.books = []
      const querySnapshot = await getDocs(collection(db, "books"))
      querySnapshot.forEach((doc) => {
        this.books.push({
          added_at: doc.data().added_at,
          author: doc.data().author,
          copies: doc.data().copies,
          genres: doc.data().genres,
          logoUrl: doc.data().logoUrl,
          numOfPages: doc.data().numOfPages,
          reviews: doc.data().reviews,
          title: doc.data().title,
          averageRating: this.calculateAvgRating(doc.data().reviews),
        })
      })
      this.loading = false
    },
    filterBooks() {
      let filteredBooks = []
      let searchedTitle = this.searchtitle.toUpperCase()
      let searchedAuthor = this.searchauthor.toUpperCase()
      let searchedGenre = this.searchgenre.toUpperCase()
      for (let book of this.books) {
        let title = book.title.toUpperCase()
        let author = book.author.toUpperCase()
        let mainGenre = book.genres.mainGenre.toUpperCase()
        let secondaryGenre = book.genres.secondaryGenre.toUpperCase()
        let tertiaryGenre = book.genres.tertiaryGenre.toUpperCase()
        if (
          (searchedTitle !== "" && title.includes(searchedTitle)) ||
          (searchedAuthor !== "" && author.includes(searchedAuthor)) ||
          (searchedGenre !== "" && mainGenre.includes(searchedGenre)) ||
          (searchedGenre !== "" && secondaryGenre.includes(searchedGenre)) ||
          (searchedGenre !== "" && tertiaryGenre.includes(searchedGenre))
        )
          filteredBooks.push(book)
      }
      this.books = filteredBooks
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
    openDialog(data) {
      this.bookToBeDeleted = data
      this.dialogActive = true
    },
    closeDialog() {
      this.dialogActive = false
      this.bookToBeDeleted = null
    },
  },
  async created() {
    await this.getAllBooks()
    if (this.searchtitle || this.searchauthor || this.searchgenre) this.filterBooks()
  },
}
</script>
