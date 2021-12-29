<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter"
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
      @click:row="displayBookDetails"
      :search="search"
    >
      <template v-slot:[`item.logo`]="{ item }">
        <v-img :src="item.logoUrl" contain height="100px"></v-img>
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
      <template v-slot:[`item.delete`] v-if="userIsAdmin">
        <v-btn color="red darken-1" fab small elevation="1">
          <v-icon color="white">mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { collection, getDocs, db, query, where } from "@/firebase.js"

export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      books: [],
      loading: false,
      search: "",
    }
  },
  computed: {
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
    headers() {
      const headers = [
        {
          text: "LOGO",
          sortable: false,
          value: "logo",
          align: "center",
        },
        { text: "BOOK TITLE", value: "title", sortable: false, align: "center" },
        { text: "AUTHOR", value: "author", sortable: false, align: "center" },
        { text: "GENRE", value: "genres", sortable: false, align: "center" },
        { text: "# OF PAGES", value: "numOfPages", sortable: false, align: "center" },
        { text: "# OF COPIES", value: "copies", sortable: false, align: "center" },
      ]
      if (this.userIsAdmin)
        headers.push({
          text: "DELETE",
          value: "delete",
          sortable: false,
          width: "100px",
          align: "center",
        })
      return headers
    },
  },
  methods: {
    async getAllBooks() {
      this.loading = true
      const querySnapshot = await getDocs(collection(db, "books"))
      querySnapshot.forEach((doc) => {
        this.books.push(doc.data())
      })
      this.loading = false
    },
    async getFilteredBooks() {
      this.loading = true
      const booksRef = collection(db, "books")
      const q = query(
        booksRef,
        where("title", ">=", this.title),
        where("title", "<=", this.title + "\uf8ff")
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.books.push(doc.data())
      })
      this.loading = false
    },
    async displayBookDetails(data) {
      let bookId = ""
      const booksRef = collection(db, "books")
      const q = query(booksRef, where("title", "==", data.title))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        bookId = doc.id
      })
      this.$router.push("/" + bookId)
    },
  },
  mounted() {
    this.$root.$on("getAllBooks", () => {
      this.books = []
      this.getAllBooks()
    })
  },
  async created() {
    if (this.title || this.author || this.genre) await this.getFilteredBooks()
    else await this.getAllBooks()
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
