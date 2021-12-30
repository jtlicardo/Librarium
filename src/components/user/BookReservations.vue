<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.cancel`]="{ item }">
      <v-icon color="red" @click="cancelReservation(item)">mdi-trash-can-outline</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import {
  db,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
} from "@/firebase.js"
export default {
  data() {
    return {
      headers: [
        {
          text: "BOOK TITLE",
          sortable: false,
          value: "title",
          align: "center",
        },
        { text: "AUTHOR", value: "author", sortable: false, align: "center" },
        {
          text: "INVENTORY NUMBER",
          value: "inventoryNumber",
          sortable: false,
          align: "center",
        },
        { text: "START DATE", value: "startDate", sortable: false, align: "center" },
        { text: "END DATE", value: "endDate", sortable: false, align: "center" },
        { text: "CANCEL", value: "cancel", sortable: false, align: "center" },
      ],
      firebaseReservations: [],
      reservations: [],
      loading: false,
    }
  },
  methods: {
    milisecondsToDate(miliseconds) {
      let date = new Date(miliseconds)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const result = day + "." + month + "." + year + "."
      return result
    },
    async getUserReservations() {
      this.loading = true
      const userId = localStorage.getItem("userId")
      const reservationsRef = collection(db, "reservations")
      const q = query(reservationsRef, where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.firebaseReservations.push({
          reservationId: doc.id,
          author: doc.data().author,
          title: doc.data().title,
          bookId: doc.data().bookId,
          copyInvNumber: doc.data().copyInvNumber,
          userId: doc.data().userId,
          start_time: doc.data().start_time,
          end_time: doc.data().end_time,
        })
        const startDate = this.milisecondsToDate(doc.data().start_time)
        const endDate = this.milisecondsToDate(doc.data().end_time)
        this.reservations.push({
          title: doc.data().title,
          author: doc.data().author,
          inventoryNumber: doc.data().copyInvNumber,
          startDate,
          endDate,
        })
      })
      this.loading = false
    },
    async cancelReservation(item) {
      const selectedReservation = this.firebaseReservations.find(
        (el) =>
          el.author === item.author &&
          el.title === item.title &&
          el.copyInvNumber === item.inventoryNumber
      )
      console.log(selectedReservation)
      try {
        const booksRef = doc(db, "books", selectedReservation.bookId)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: selectedReservation.copyInvNumber,
            status: "Reserved",
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: selectedReservation.copyInvNumber,
            status: "Available",
          }),
        })
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("uid", "==", selectedReservation.userId))
        const querySnapshot = await getDocs(q)
        let selectedUser = ""
        querySnapshot.forEach((doc) => {
          selectedUser = doc.id
        })
        const users = doc(db, "users", selectedUser)
        await updateDoc(users, {
          reservations: arrayRemove(selectedReservation.reservationId),
        })
        await deleteDoc(doc(db, "reservations", selectedReservation.reservationId))
        this.$store.dispatch("displaySnackbar", {
          text: "Reservation canceled!",
          isActive: true,
        })
        this.reservations = []
        await this.getUserReservations()
      } catch (e) {
        console.log("Error: ", e)
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
  async created() {
    await this.getUserReservations()
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 80% !important;
}

@media only screen and (max-width: 1264px) {
  .v-data-table {
    max-width: 100% !important;
  }
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
