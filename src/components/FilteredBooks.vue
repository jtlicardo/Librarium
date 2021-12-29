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
    filterBooks() {
      let filteredBooks = []
      let searchedTitle = this.title.toUpperCase()
      let searchedAuthor = this.author.toUpperCase()
      let searchedGenre = this.genre.toUpperCase()
      for (let book of this.books) {
        let title = book.title.toUpperCase()
        let author = book.author.toUpperCase()
        let mainGenre = book.genres.mainGenre.toUpperCase()
        let secondaryGenre = book.genres.secondaryGenre.toUpperCase()
        let tertiaryGenre = book.genres.tertiaryGenre.toUpperCase()
        if (
          (searchedTitle !== "" && title.includes(searchedTitle)) ||
          (searchedAuthor !== "" && author.includes(searchedAuthor)) ||
          (searchedGenre !== "" && mainGenre.includes(searchedGenre)) ||
          (searchedGenre !== "" && secondaryGenre.includes(searchedGenre)) ||
          (searchedGenre !== "" && tertiaryGenre.includes(searchedGenre))
        )
          filteredBooks.push(book)
      }
      this.books = filteredBooks
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
    await this.getAllBooks()
    if (this.title || this.author || this.genre) this.filterBooks()
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
