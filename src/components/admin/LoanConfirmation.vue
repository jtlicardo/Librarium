<template>
  <div>
    <h3 class="mb-10 text-center">Please check loan details and confirm</h3>
    <v-card max-width="500px" class="mb-5 mx-auto">
      <div class="d-flex flex-no-wrap justify-space-between mt-3">
        <div>
          <v-card-title
            class="text-subtitle-1 text-sm-h5 text-md-subtitle-1 text-lg-h6 word-break"
          >
            {{ bookTitle }}
          </v-card-title>
          <v-card-subtitle>
            <p>by {{ bookAuthor }}</p>
            <p>Inventory number: {{ copyInvNumber }}</p>
          </v-card-subtitle>
        </div>
        <v-avatar class="ma-3" :size="cardSize" tile>
          <v-img :src="bookLogoUrl" contain></v-img>
        </v-avatar>
      </div>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="userData"
      hide-default-footer
      class="elevation-1 mx-auto"
    ></v-data-table>
    <v-container class="text-center mt-12">
      <v-btn color="red white--text" class="mx-2" @click="cancelLoan">Cancel</v-btn>
      <v-btn color="yellow darken-1" class="mx-2" @click="addLoan">Confirm</v-btn>
    </v-container>
  </div>
</template>

<script>
import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  deleteDoc,
} from "@/firebase.js"
export default {
  props: ["user", "book", "copy"],
  data() {
    return {
      headers: [
        {
          text: "FULL NAME",
          sortable: false,
          value: "displayName",
          align: "center",
        },
        {
          text: "EMAIL",
          value: "email",
          sortable: false,
          align: "center",
        },
      ],
    }
  },
  computed: {
    userData() {
      let user = []
      user.push(this.user)
      return user
    },
    bookTitle() {
      return this.book.title
    },
    bookAuthor() {
      return this.book.author
    },
    bookLogoUrl() {
      return this.book.logoUrl
    },
    copyInvNumber() {
      return this.copy.inventoryNumber
    },
    copyStatus() {
      return this.copy.status
    },
    userReservedTheCopy() {
      return this.copy.userReservedCopy
    },
    cardSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return 100
        default:
          return 125
      }
    },
  },
  methods: {
    cancelLoan() {
      this.$router.replace({ name: "Admin Loans" })
    },
    async getUserId() {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", this.user.email))
      const querySnapshot = await getDocs(q)
      let uid = ""
      querySnapshot.forEach((doc) => {
        uid = doc.data().uid
      })
      return uid
    },
    async getBookDocumentId() {
      const booksRef = collection(db, "books")
      const q = query(
        booksRef,
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
    },
    async addLoan() {
      try {
        const userId = await this.getUserId()
        const bookId = await this.getBookDocumentId()
        // add loan
        const docRef = await addDoc(collection(db, "loans"), {
          userId,
          bookId,
          title: this.bookTitle,
          author: this.bookAuthor,
          copyInvNumber: this.copyInvNumber,
          issue_time: Date.now(),
          due_time: Date.now() + 1209600000,
          return_time: null,
          loan_status: "In progress",
          extensionRequested: false,
          extensionApproved: null,
        })
        console.log("Document written with ID: ", docRef.id)
        // add loan id to user
        const users = collection(db, "users")
        const q = query(users, where("uid", "==", userId))
        const querySnapshot = await getDocs(q)
        let userDocId = ""
        querySnapshot.forEach((doc) => {
          userDocId = doc.id
        })
        const usersRef = doc(db, "users", userDocId)
        await updateDoc(usersRef, {
          loans: arrayUnion(docRef.id),
        })
        // if user reserved the copy: remove reservation id from user; delete the reservation
        if (this.userReservedTheCopy) {
          const reservations = collection(db, "reservations")
          const q = query(
            reservations,
            where("userId", "==", userId),
            where("bookId", "==", bookId),
            where("copyInvNumber", "==", this.copyInvNumber)
          )
          const querySnapshot = await getDocs(q)
          let reservationId = ""
          querySnapshot.forEach((doc) => {
            reservationId = doc.id
          })
          await updateDoc(usersRef, {
            reservations: arrayRemove(reservationId),
          })
          await deleteDoc(doc(db, "reservations", reservationId))
        }
        // update copy status
        const booksRef = doc(db, "books", bookId)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: this.copy.inventoryNumber,
            status: this.copyStatus,
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: this.copy.inventoryNumber,
            status: "Loaned",
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy loaned!",
          isActive: true,
        })
        this.$router.replace({ name: "Admin Loans" })
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
}
</script>

<style scoped>
.v-data-table {
  max-width: 600px !important;
}
</style>
