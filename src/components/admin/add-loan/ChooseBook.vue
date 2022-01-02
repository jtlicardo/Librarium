<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter (by title or author)"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="books"
      :items-per-page="5"
      class="elevation-1"
      no-data-text="No books found"
      :loading="loading"
      loading-text="Loading books..."
      @click:row="chooseBook"
      :search="search"
    >
      <template v-slot:[`item.logo`]="{ item }">
        <v-img :src="item.logoUrl" contain height="100px"></v-img>
      </template>
      <template v-slot:[`item.genres`]="{ item }">
        <ul>
          <li v-for="(genre, index) in item.genres" :key="index">
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
  </v-card>
</template>

<script>
import { collection, getDocs, db, query, where } from "@/firebase.js"

export default {
  emits: ["book-chosen"],
  data() {
    return {
      books: [],
      loading: false,
      search: "",
    }
  },
  computed: {
    headers() {
      const headers = [
        {
          text: "LOGO",
          sortable: false,
          value: "logo",
          align: "center",
          filterable: false,
        },
        {
          text: "BOOK TITLE",
          value: "title",
          sortable: false,
          align: "center",
          filterable: true,
        },
        {
          text: "AUTHOR",
          value: "author",
          sortable: false,
          align: "center",
          filterable: true,
        },
        {
          text: "GENRE",
          value: "genres",
          sortable: false,
          align: "center",
          filterable: false,
        },
        {
          text: "# OF PAGES",
          value: "numOfPages",
          sortable: false,
          align: "center",
          filterable: false,
          sortable: true,
        },
        {
          text: "# OF COPIES",
          value: "copies",
          sortable: false,
          align: "center",
          filterable: false,
        },
      ]
      return headers
    },
  },
  methods: {
    async getAllBooks() {
      this.loading = true
      this.books = []
      const querySnapshot = await getDocs(collection(db, "books"))
      querySnapshot.forEach((doc) => {
        this.books.push(doc.data())
      })
      this.loading = false
    },
    chooseBook(data) {
      this.$emit("book-chosen", data)
    },
  },
  async created() {
    await this.getAllBooks()
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

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr {
  transition: all 0.3s ease;
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr:hover {
  color: black;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  cursor: pointer;
}
</style>
