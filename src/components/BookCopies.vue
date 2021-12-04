<template>
  <v-data-table
    :headers="headers"
    :items="bookCopies"
    hide-default-footer
    class="elevation-1 grey lighten-4"
  >
    <template v-slot:[`item.reserve`]>
      <v-btn color="yellow darken-1" elevation="1">RESERVE</v-btn>
    </template>
  </v-data-table>
  <!-- <p>sas {{ bookCopies }}</p> -->
</template>

<script>
export default {
  props: ["bookId"],
  data() {
    return {
      selectedBook: null,
      headers: [
        {
          text: "INVENTORY NUMBER",
          sortable: false,
          value: "inventoryNumber",
        },
        { text: "STATUS", value: "status", sortable: false },
        { text: "", value: "reserve", sortable: false },
      ],
    }
  },
  created() {
    this.selectedBook = this.$store.getters["books/allBooks"].find(
      (book) => book.id === this.bookId
    )
  },
  computed: {
    bookCopies() {
      return this.selectedBook.copies
    },
  },
}
</script>

<style></style>
