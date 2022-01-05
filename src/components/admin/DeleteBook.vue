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
import {
  db,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  deleteObject,
  storage,
  ref,
} from "@/firebase.js"
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
    async checkForReservations(bookDocumentId) {
      const reservationsRef = collection(db, "reservations")
      const q = query(reservationsRef, where("bookId", "==", bookDocumentId))
      const querySnapshot = await getDocs(q)
      let reservationIds = []
      querySnapshot.forEach((doc) => {
        reservationIds.push(doc.id)
      })
      return reservationIds
    },
    async deleteReservation(reservationId) {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("reservations", "array-contains", reservationId))
      const querySnapshot = await getDocs(q)
      let userDocumentId = ""
      querySnapshot.forEach((doc) => {
        userDocumentId = doc.id
      })
      if (userDocumentId !== "") {
        const user = doc(db, "users", userDocumentId)
        await updateDoc(user, {
          reservations: arrayRemove(reservationId),
        })
      }
      await deleteDoc(doc(db, "reservations", reservationId))
    },
    async deleteBook() {
      this.$store.dispatch("displayLoadingDialog", {
        active: true,
        title: "Deleting book...",
      })
      try {
        const bookDocumentId = await this.findBook()
        const reservationIds = await this.checkForReservations(bookDocumentId)
        if (reservationIds.length > 0) {
          for (let id of reservationIds) {
            await this.deleteReservation(id)
          }
        }
        await deleteDoc(doc(db, "books", bookDocumentId))
        const storageRef = ref(
          storage,
          `gs://librarium-11060.appspot.com/${bookDocumentId}`
        )
        await deleteObject(storageRef)
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
      this.$store.dispatch("displayLoadingDialog", {
        active: false,
        title: "",
      })
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
