<template>
  <v-row justify="center">
    <v-dialog v-model="active" persistent width="400px">
      <v-card>
        <v-card-title>
          <h2 class="mx-auto">Delete book</h2>
        </v-card-title>
        <v-card-subtitle>
          <h3 class="text-center mt-10">Are you sure you want to delete this book?</h3>
          <p class="text-center mt-5 mb-0">{{ bookTitle }}</p>
          <p class="text-center mb-0">{{ bookAuthor }}</p>
        </v-card-subtitle>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" class="px-4 mx-auto" text @click="closeDialog">
            Close
          </v-btn>
          <v-btn color="red white--text" class="px-4 mx-auto" @click="deleteBook">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { db, collection, query, where, getDocs, deleteDoc, doc } from "@/firebase.js"
export default {
  props: ["active", "book"],
  emits: ["close-dialog", "deleted"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog")
    },
    async findBook() {
      try {
        const booksRef = collection(db, "books")
        const q = query(
          booksRef,
          where("added_at", "==", this.book.added_at),
          where("title", "==", this.book.title),
          where("author", "==", this.book.author),
          where("logoUrl", "==", this.book.logoUrl)
        )
        const querySnapshot = await getDocs(q)
        let bookDocumentId = ""
        querySnapshot.forEach((doc) => {
          bookDocumentId = doc.id
        })
        return bookDocumentId
      } catch (e) {
        console.log(e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
    },
    async deleteBook() {
      try {
        const bookDocumentId = await this.findBook()
        console.log(bookDocumentId)
        await deleteDoc(doc(db, "books", bookDocumentId))
        this.$store.dispatch("displaySnackbar", {
          text: "Book deleted!",
          isActive: true,
        })
        this.$emit("deleted")
        this.closeDialog()
      } catch (e) {
        console.log(e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
    },
  },
  computed: {
    bookTitle() {
      if (!!this.book) return this.book.title
    },
    bookAuthor() {
      if (!!this.book) return this.book.author
    },
  },
}
</script>

<style scoped></style>
