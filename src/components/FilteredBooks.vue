<template>
  <v-data-table
    :headers="headers"
    :items="filteredBooks"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:[`item.logo`]="{ item }">
      <v-img :src="item.logo" contain height="100px"></v-img>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "LOGO",
          sortable: false,
          value: "logo",
        },
        { text: "BOOK TITLE", value: "title", sortable: false },
        { text: "AUTHOR", value: "author", sortable: false },
        { text: "GENRE", value: "genres", sortable: false },
        { text: "# OF PAGES", value: "page_num", sortable: false },
        { text: "# OF COPIES", value: "copies", sortable: false },
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

<style scoped>
.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  max-width: 50px;
}
</style>
