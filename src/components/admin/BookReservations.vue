<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.delete`]="{ item }">
      <v-icon color="red" @click="deleteReservation(item)">mdi-trash-can-outline</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import {
  db,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
} from "@/firebase.js"
export default {
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "BOOK COPY",
          sortable: false,
          value: "copy",
          align: "center",
        },
        { text: "USER", value: "user", sortable: false, align: "center" },
        { text: "START DATE", value: "startDate", sortable: false, align: "center" },
        { text: "END DATE", value: "endDate", sortable: false, align: "center" },
        { text: "DELETE", value: "delete", sortable: false, align: "center" },
      ],
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
    async getAllReservations() {
      this.loading = true
      const querySnapshot = await getDocs(collection(db, "reservations"))
      querySnapshot.forEach((doc) => {
        const copy =
          doc.data().title + ", " + doc.data().author + ", " + doc.data().copyInvNumber
        const userId = doc.data().userId
        const startDate = this.milisecondsToDate(doc.data().start_time)
        const endDate = this.milisecondsToDate(doc.data().end_time)
        this.reservations.push({
          firebaseReservationId: doc.id,
          firebaseTitle: doc.data().title,
          firebaseAuthor: doc.data().author,
          firebaseCopyInvNumber: doc.data().copyInvNumber,
          firebaseUserId: userId,
          firebaseBookId: doc.data().bookId,
          firebaseStartTime: doc.data().start_time,
          firebaseEndTime: doc.data().end_time,
          copy,
          user: userId,
          startDate,
          endDate,
        })
      })
      await this.changeAllIdsToEmails(this.reservations)
      this.loading = false
    },
    async userIdToEmail(userId) {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("uid", "==", userId))
      const querySnapshot = await getDocs(q)
      let email = ""
      querySnapshot.forEach((doc) => {
        email = doc.data().email
      })
      return email
    },
    async changeAllIdsToEmails(reservations) {
      for (let reservation of reservations) {
        const userId = reservation.user
        const email = await this.userIdToEmail(userId)
        reservation.user = email
      }
    },
    async deleteReservation(item) {
      try {
        // set copy status to "Available"
        const booksRef = doc(db, "books", item.firebaseBookId)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: item.firebaseCopyInvNumber,
            status: "Reserved",
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: item.firebaseCopyInvNumber,
            status: "Available",
          }),
        })
        // remove reservation id from users collection
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("uid", "==", item.firebaseUserId))
        const querySnapshot = await getDocs(q)
        let selectedUser = ""
        querySnapshot.forEach((doc) => {
          selectedUser = doc.id
        })
        const users = doc(db, "users", selectedUser)
        await updateDoc(users, {
          reservations: arrayRemove(item.firebaseReservationId),
        })
        // delete reservation
        await deleteDoc(doc(db, "reservations", item.firebaseReservationId))
        this.$store.dispatch("displaySnackbar", {
          text: "Reservation deleted!",
          isActive: true,
        })
        this.reservations = []
        await this.getAllReservations()
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
  created() {
    this.getAllReservations()
  },
}
</script>

<style scoped></style>
