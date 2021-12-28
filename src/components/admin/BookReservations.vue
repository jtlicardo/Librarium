<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.delete`]>
      <v-btn class="mx-2" color="red darken-1" fab x-small elevation="1">
        <v-icon color="white">mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, getDocs, query, where } from "@/firebase.js"
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
  },
  created() {
    this.getAllReservations()
  },
}
</script>

<style scoped></style>
