<template>
  <v-data-table
    :headers="headers"
    :items="bookCopies"
    hide-default-footer
    class="elevation-1 grey lighten-5"
  >
    <template v-slot:[`item.status`]="{ item }">
      <book-status :type="item.status" class="mx-auto" />
    </template>
    <template v-slot:[`item.reserve`]="{ item }">
      <v-btn color="yellow darken-1" elevation="1" v-if="item.status === 'Available'">
        RESERVE
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import BookStatus from "@/components/book-details/BookStatus.vue"

export default {
  props: ["bookId"],
  components: {
    BookStatus,
  },
  data() {
    return {
      selectedBook: null,
      headers: [
        {
          text: "INVENTORY NUMBER",
          sortable: false,
          value: "inventoryNumber",
          align: "center",
        },
        { text: "STATUS", value: "status", sortable: false, align: "center" },
        { text: "", value: "reserve", sortable: false, align: "right" },
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

<style scoped>
.v-data-table {
  max-width: 600px !important;
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
