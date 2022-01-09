<template>
  <div class="text-center">
    <div class="filter mb-10">
      <h2 class="mb-8">Filter books</h2>
      <v-text-field label="Title" v-model.trim="filter.title"></v-text-field>
      <v-text-field label="Author" v-model.trim="filter.author"></v-text-field>
      <v-btn color="grey white--text mt-4" @click="applyFilter" v-if="!filterApplied">
        Filter
      </v-btn>
      <v-btn color="grey white--text mt-4" @click="clearFilter" v-else>
        Clear filter
      </v-btn>
      <div v-if="filterApplied">
        <p class="mt-4 mb-0"><b>Filter active</b></p>
        <p class="mb-0" v-if="currentFilter.title !== ''">
          Title: {{ currentFilter.title }}
        </p>
        <p v-if="currentFilter.author !== ''">Author: {{ currentFilter.author }}</p>
      </div>
    </div>
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
      choosebook="true"
      @book-chosen="chooseBook"
      class="mx-auto"
    ></mobile-search-card>
    <p v-if="books.length === 0 && !loading">No books found</p>
  </div>
</template>

<script>
import MobileSearchCard from "@/components/MobileSearchCard.vue"

import { collection, getDocs, db, query, where } from "@/firebase.js"

export default {
  components: {
    MobileSearchCard,
  },
  data() {
    return {
      books: [],
      search: "",
      loading: false,
      filter: {
        title: "",
        author: "",
      },
      filterApplied: false,
      currentFilter: {
        title: "",
        author: "",
      },
    }
  },
  computed: {
    backButtonActiveOnRefresh() {
      return this.$store.getters.backButtonActiveOnRefresh
    },
  },
  methods: {
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
        })
      })
      this.loading = false
    },
    applyFilter() {
      this.filterApplied = true
      this.currentFilter.title = this.filter.title
      this.currentFilter.author = this.filter.author
      this.filterBooks()
    },
    clearFilter() {
      this.filterApplied = false
      this.filter.title = ""
      this.filter.author = ""
      this.currentFilter.title = ""
      this.currentFilter.author = ""
      this.getAllBooks()
    },
    filterBooks() {
      let filteredBooks = []
      let searchedTitle = this.currentFilter.title.toUpperCase()
      let searchedAuthor = this.currentFilter.author.toUpperCase()
      for (let book of this.books) {
        let title = book.title.toUpperCase()
        let author = book.author.toUpperCase()
        if (
          (searchedTitle !== "" && title.includes(searchedTitle)) ||
          (searchedAuthor !== "" && author.includes(searchedAuthor))
        )
          filteredBooks.push(book)
      }
      this.books = filteredBooks
    },
    chooseBook(payload) {
      this.$emit("book-chosen", payload)
    },
  },
  async created() {
    await this.getAllBooks()
  },
}
</script>

<style scoped>
.filter {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 5px;
  padding: 20px 30px;
  background-color: #fafafa;
}
</style>
