<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" lg="1"></v-col>
      <v-col cols="12" lg="10">
        <h1>Search results</h1>
        <p class="mb-5">Click on a book to see more details</p>
        <filtered-books v-if="!isMobile" :title="title" :author="author" :genre="genre" />
        <filtered-books-mobile
          v-else
          :searchtitle="title"
          :searchauthor="author"
          :searchgenre="genre"
        ></filtered-books-mobile>
        <p class="mt-15">Can't find the book you're looking for?</p>
        <p>
          <a @click="openDialog">Send a request</a>
          to add a book to the library's collection.
        </p>
      </v-col>
      <v-col cols="12" lg="1"></v-col>
    </v-row>
    <send-request
      :active="sendRequestDialogActive"
      @close-dialog="closeDialog"
    ></send-request>
  </v-container>
</template>

<script>
import FilteredBooks from "@/components/FilteredBooks.vue"
import FilteredBooksMobile from "@/components/FilteredBooksMobile.vue"
import SendRequest from "@/components/user/SendRequest.vue"

export default {
  components: {
    FilteredBooks,
    FilteredBooksMobile,
    SendRequest,
  },
  data() {
    return {
      title: "",
      author: "",
      genre: "",
      sendRequestDialogActive: false,
    }
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
  methods: {
    setFilters() {
      this.title = this.$route.query.title
      this.author = this.$route.query.author
      this.genre = this.$route.query.genre
    },
    openDialog() {
      this.sendRequestDialogActive = true
    },
    closeDialog() {
      this.sendRequestDialogActive = false
    },
  },
  created() {
    this.setFilters()
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}

p,
p a {
  color: gray;
}

p a {
  text-decoration: underline;
  font-weight: 500;
}
</style>
