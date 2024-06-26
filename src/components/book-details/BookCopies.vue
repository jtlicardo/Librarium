<template>
  <v-data-table
    :headers="headers"
    :items="bookCopies"
    class="elevation-1 grey lighten-5"
    v-if="selectedBook"
    :loading="loading"
  >
    <template v-slot:[`item.status`]="{ item }">
      <copy-status :type="item.status" class="mx-auto" />
    </template>
    <template v-slot:[`item.reserve`]="{ item }" v-if="!userIsAdmin">
      <v-btn
        color="yellow darken-1"
        elevation="1"
        class="reserve-button"
        v-if="item.status === 'Available' && userCanReserve"
        @click="reserveCopy(item)"
      >
        RESERVE
      </v-btn>
    </template>
    <template v-slot:[`item.delete`]="{ item }" v-if="userIsAdmin">
      <v-btn
        color="red white--text"
        elevation="1"
        class="delete-button"
        @click="deleteCopy(item)"
        v-if="item.status === 'Available'"
      >
        DELETE
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import CopyStatus from "@/components/book-details/CopyStatus.vue"
import {
  doc,
  getDoc,
  db,
  updateDoc,
  arrayRemove,
  collection,
  addDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "@/firebase.js"

export default {
  props: ["id", "title", "author"],
  emits: ["copy-deleted", "copy-reserved"],
  components: {
    CopyStatus,
  },
  data() {
    return {
      selectedBook: null,
      userAlreadyReservedCopy: null,
      userHasLoan: null,
      userNumOfReservations: 0,
      loading: false,
    }
  },
  methods: {
    async getBookData() {
      const docRef = doc(db, "books", this.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.selectedBook = docSnap.data()
      } else {
        console.log("No such document!")
      }
    },
    async checkIfUserReservedCopy() {
      const userId = localStorage.getItem("userId")
      const reservationsRef = collection(db, "reservations")
      const q = query(
        reservationsRef,
        where("bookId", "==", this.id),
        where("userId", "==", userId)
      )
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty === true) this.userAlreadyReservedCopy = false
      else this.userAlreadyReservedCopy = true
    },
    async checkIfUserHasLoan() {
      const userId = localStorage.getItem("userId")
      const loansRef = collection(db, "loans")
      const q = query(
        loansRef,
        where("bookId", "==", this.id),
        where("userId", "==", userId)
      )
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty === true) this.userHasLoan = false
      else {
        querySnapshot.forEach((doc) => {
          if (doc.data().loan_status !== "Finished") {
            this.userHasLoan = true
            return
          }
        })
      }
      if (this.userHasLoan === true) return
      else this.userHasLoan = false
    },
    async checkNumOfReservationsForUser() {
      const userId = localStorage.getItem("userId")
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("uid", "==", userId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.userNumOfReservations = doc.data().reservations.length
      })
    },
    async deleteCopy(item) {
      const inventoryNumber = item.inventoryNumber
      const status = item.status
      try {
        const booksRef = doc(db, "books", this.id)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: inventoryNumber,
            status: status,
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy successfully deleted!",
          isActive: true,
        })
        this.loading = true
        await this.getBookData()
        this.loading = false
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
    async reserveCopy(item) {
      const userId = localStorage.getItem("userId")
      const bookId = this.id
      const title = this.title
      const author = this.author
      const copyInvNumber = item.inventoryNumber
      const start_time = Date.now()
      const end_time = Date.now() + 259200000
      try {
        const docRef = await addDoc(collection(db, "reservations"), {
          userId,
          title,
          author,
          bookId,
          copyInvNumber,
          start_time,
          end_time,
        })
        const users = collection(db, "users")
        const q = query(users, where("uid", "==", userId))
        const querySnapshot = await getDocs(q)
        let userDocId = ""
        querySnapshot.forEach((doc) => {
          userDocId = doc.id
        })
        const usersRef = doc(db, "users", userDocId)
        await updateDoc(usersRef, {
          reservations: arrayUnion(docRef.id),
        })
        const booksRef = doc(db, "books", this.id)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: item.inventoryNumber,
            status: item.status,
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: item.inventoryNumber,
            status: "Reserved",
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy reserved!",
          isActive: true,
        })
        this.loading = true
        await this.checkIfUserReservedCopy()
        await this.checkIfUserHasLoan()
        await this.checkNumOfReservationsForUser()
        await this.getBookData()
        this.loading = false
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
  async mounted() {
    this.loading = true
    await this.checkIfUserReservedCopy()
    await this.checkIfUserHasLoan()
    await this.checkNumOfReservationsForUser()
    await this.getBookData()
    this.loading = false
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "INVENTORY NUMBER",
          sortable: false,
          value: "inventoryNumber",
          align: "center",
        },
        { text: "STATUS", value: "status", sortable: false, align: "center" },
      ]
      if (this.userIsAdmin)
        headers.push({ text: "", value: "delete", sortable: false, align: "right" })
      else headers.push({ text: "", value: "reserve", sortable: false, align: "right" })
      return headers
    },
    bookCopies() {
      return this.selectedBook.copies
    },
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
    },
    userCanReserve() {
      if (
        this.userNumOfReservations < 3 &&
        this.userAlreadyReservedCopy === false &&
        this.userHasLoan === false
      )
        return true
      else return false
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

.v-data-table__mobile-row__cell > button.reserve-button,
.v-data-table__mobile-row__cell > button.delete-button {
  margin-top: 30px;
  margin-bottom: 40px;
}

.v-data-table
  >>> .v-data-table__wrapper
  > table
  > tbody
  > .v-data-table__mobile-table-row
  > .v-data-table__mobile-row:last-child
  > .v-data-table__mobile-row__cell {
  margin: 0 auto;
}
</style>
