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
    <template v-slot:[`item.genres`]="{ item }">
      <ul>
        <li v-for="genre in item.genres" :key="genre">
          <span>{{ genre }}</span>
        </li>
      </ul>
    </template>
    <template v-slot:[`item.copies`]="{ item }">
      <p>
        {{ item.copies.length }}
      </p>
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
      return this.$store.getters.filteredBooks
    },
  },
}
</script>

<style scoped>
.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  max-width: 50px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li span {
  position: relative;
}

ul li span::after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  content: "";
}
</style>
