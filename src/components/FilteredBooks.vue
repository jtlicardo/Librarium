<template>
  <v-data-table
    :headers="headers"
    :items="filteredBooks"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "LOGO",
          sortable: false,
          value: "bookTitle",
        },
        { text: "BOOK TITLE", value: "author", sortable: false },
        { text: "AUTHOR", value: "inventoryNumber", sortable: false },
        { text: "GENRE", value: "issueDate", sortable: false },
        { text: "# OF PAGES", value: "dueDate", sortable: false },
        { text: "# OF COPIES", value: "request", sortable: false },
      ],
    }
  },
  computed: {
    filteredBooks() {
      return this.$store.getters.books
    },
  },
}
</script>

<style></style>
