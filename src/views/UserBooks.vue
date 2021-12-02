<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="3">
        <h1 class="mb-5">Search for a book...</h1>
        <v-form>
          <v-text-field label="Title" v-model="searchFilter.title"></v-text-field>
          <v-text-field label="Author" v-model="searchFilter.author"></v-text-field>
          <v-text-field label="Genre" v-model="searchFilter.genre"></v-text-field>
          <v-btn
            elevation="2"
            color="yellow darken-1"
            class="mt-5 mb-5"
            to="/search"
            @click.native="filterBooks"
          >
            Search
          </v-btn>
          <h3 class="mt-5">
            ...or
            <router-link to="/search" @click.native="toggleBackButton">
              see all books.
            </router-link>
          </h3>
        </v-form>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="12" md="5">
        <h1>Recently added books</h1>
        <div class="mt-5">
          <book-card></book-card>
          <book-card></book-card>
          <book-card></book-card>
          <book-card></book-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookCard from "@/components/BookCard.vue"

export default {
  components: {
    BookCard,
  },
  data() {
    return {
      searchFilter: {
        title: "",
        author: "",
        genre: "",
      },
    }
  },
  methods: {
    toggleBackButton() {
      this.$store.dispatch("showBackButton")
      this.$store.dispatch("showBackButtonActive")
    },
    filterBooks() {
      this.toggleBackButton()
      this.$store.dispatch("updateFilters", this.searchFilter)
    },
  },
}
</script>

<style scoped>
h1,
h3 {
  font-weight: 400;
}

h3 a {
  color: black;
}
</style>
