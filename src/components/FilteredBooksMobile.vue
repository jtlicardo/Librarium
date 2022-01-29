<template>
  <div class="text-center">
    <v-divider id="books" class="mb-16"></v-divider>
    <div class="books">
      <mobile-search-card
        v-for="(book, index) in booksGroup"
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
    </div>
    <div class="text-center">
      <v-pagination
        v-if="numOfPages > 1"
        v-model="page"
        :length="numOfPages"
        class="my-10"
        @previous="changePage"
        @next="changePage"
      ></v-pagination>
    </div>
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
      booksGroup: [],
      search: "",
      loading: false,
      page: 1,
      arrowPageChange: false,
      bookToBeDeleted: null,
      dialogActive: false,
    }
  },
  computed: {
    numOfPages() {
      return Math.ceil(this.books.length / 10)
    },
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
  },
  methods: {
    splitBooks(pageNum) {
      this.booksGroup = []
      let startSliceNum = 0
      if (pageNum > 1) startSliceNum = 10 * (pageNum - 1)
      this.booksGroup = this.books.slice(startSliceNum, startSliceNum + 10)
    },
    timeout(miliseconds) {
      return new Promise((resolve) => setTimeout(resolve, miliseconds))
    },
    async changePage() {
      this.arrowPageChange = true
      document.querySelector(".books").classList.toggle("fadeout")
      await this.timeout(500)
      this.splitBooks(this.page)
      document.querySelector(".books").classList.toggle("fadein")
      await this.timeout(500)
      document.querySelector(".books").classList.remove("fadeout")
      document.querySelector(".books").classList.remove("fadein")
      if (this.userIsAdmin) window.scroll({ top: 400, behavior: "smooth" })
      else window.scroll({ top: 100, behavior: "smooth" })
      this.arrowPageChange = false
    },
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
      this.splitBooks(1)
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
      this.splitBooks(1)
    },
    async displayBookDetails(title) {
      let bookId = ""
      const booksRef = collection(db, "books")
      const q = query(booksRef, where("title", "==", title))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
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
  watch: {
    page(newValue) {
      if (!this.arrowPageChange) {
        document.querySelector(".books").classList.toggle("fadeout")
        this.timeout(500).then(() => {
          this.splitBooks(newValue)
          document.querySelector(".books").classList.toggle("fadein")
          this.timeout(500).then(() => {
            document.querySelector(".books").classList.remove("fadeout")
            document.querySelector(".books").classList.remove("fadein")
            if (this.userIsAdmin) window.scroll({ top: 400, behavior: "smooth" })
            else window.scroll({ top: 100, behavior: "smooth" })
          })
        })
      }
    },
  },
  async created() {
    await this.getAllBooks()
    if (this.searchtitle || this.searchauthor || this.searchgenre) this.filterBooks()
  },
  mounted() {
    this.$root.$on("getAllBooksMobile", () => {
      this.books = []
      this.getAllBooks()
    })
  },
}
</script>

<style scoped>
.fadeout {
  opacity: 0;
  transition: all 0.5s;
}

.fadein {
  opacity: 1;
  transition: all 0.5s;
}
</style>
