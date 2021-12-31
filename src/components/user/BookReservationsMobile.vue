<template>
  <v-data-table
    :headers="headerTitles"
    :items="reservations"
    :single-expand="singleExpand"
    item-key="title"
    show-expand
    hide-default-header
    hide-default-footer
    class="elevation-1"
    @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
  >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="py-5">
        <b class="text-h6">RESERVATIONS DETAILS</b>
        <p class="my-0">
          <b>Book title:</b>
          {{ item.title }}
        </p>
        <p class="my-0">
          <b>Author:</b>
          {{ item.author }}
        </p>
        <p class="my-0">
          <b>Inventory number:</b>
          {{ item.inventoryNumber }}
        </p>
        <p class="my-0">
          <b>Start date:</b>
          {{ item.startDate }}
        </p>
        <p class="my-0">
          <b>End date:</b>
          {{ item.endDate }}
        </p>
        <v-btn
          class="mt-3 white--text"
          color="red darken-1"
          @click="cancelReservation(item)"
        >
          CANCEL RESERVATION
        </v-btn>
      </td>
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
      singleExpand: true,
      headerTitles: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "title",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
      firebaseReservations: [],
      reservations: [],
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
  max-width: 100% !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
