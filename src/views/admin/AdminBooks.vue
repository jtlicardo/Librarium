<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" lg="1"></v-col>
      <v-col cols="12" lg="10">
        <h1 class="mb-5 d-inline-block">All books</h1>
        <p class="mb-10">Click on a book to see more details</p>
        <div v-if="isMobile" class="text-center">
          <div class="filter mb-10">
            <h2 class="mb-8">Filter books</h2>
            <v-text-field label="Title" v-model.trim="filter.title"></v-text-field>
            <v-text-field label="Author" v-model.trim="filter.author"></v-text-field>
            <v-btn
              color="grey white--text mt-4"
              @click="applyFilter"
              v-if="!filterApplied"
            >
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
          <filtered-books-mobile
            :searchtitle="filter.title"
            :searchauthor="filter.author"
            searchgenre=""
            ref="filteredBooksMobile"
          ></filtered-books-mobile>
        </div>
        <filtered-books v-else></filtered-books>
        <v-btn class="my-14" color="yellow darken-1" @click="addBook">Add book</v-btn>
        <add-book :active="addBookDialogActive" @close-dialog="closeDialog"></add-book>
      </v-col>
      <v-col cols="12" lg="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilteredBooks from "@/components/FilteredBooks.vue"
import FilteredBooksMobile from "@/components/FilteredBooksMobile.vue"
import AddBook from "@/components/admin/AddBook.vue"
export default {
  components: {
    FilteredBooks,
    FilteredBooksMobile,
    AddBook,
  },
  data() {
    return {
      addBookDialogActive: false,
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
  methods: {
    addBook() {
      this.addBookDialogActive = true
    },
    closeDialog() {
      this.addBookDialogActive = false
    },
    applyFilter() {
      this.filterApplied = true
      this.currentFilter.title = this.filter.title
      this.currentFilter.author = this.filter.author
      this.$refs.filteredBooksMobile.filterBooks()
    },
    clearFilter() {
      this.filterApplied = false
      this.filter.title = ""
      this.filter.author = ""
      this.currentFilter.title = ""
      this.currentFilter.author = ""
      this.$refs.filteredBooksMobile.getAllBooks()
    },
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
  },
}
</script>

<style scoped>
h1,
h2 {
  font-weight: 400;
}

.filter {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 5px;
  padding: 20px 30px;
  background-color: #fafafa;
}
</style>
