<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5 d-inline-block">All books</h1>
        <p class="mb-10">Click on a book to see more details</p>
        <filtered-books></filtered-books>
        <v-btn class="my-14" color="yellow darken-1" @click="addBook">Add book</v-btn>
        <add-book :active="addBookDialogActive" @close-dialog="closeDialog"></add-book>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilteredBooks from "@/components/FilteredBooks.vue"
import AddBook from "@/components/admin/AddBook.vue"
export default {
  components: {
    FilteredBooks,
    AddBook,
  },
  data() {
    return {
      addBookDialogActive: false,
    }
  },
  methods: {
    addBook() {
      this.addBookDialogActive = true
    },
    closeDialog() {
      this.addBookDialogActive = false
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
