<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1 grey lighten-4"
  >
    <template v-slot:[`item.cancel`]>
      <v-btn class="mx-2" color="red darken-1" fab x-small elevation="1">
        <v-icon color="white">mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, query, where, getDocs } from "@/firebase.js"
export default {
  data() {
    return {
      headers: [
        {
          text: "BOOK TITLE",
          sortable: false,
          value: "title",
        },
        { text: "AUTHOR", value: "author", sortable: false },
        { text: "INVENTORY NUMBER", value: "inventoryNumber", sortable: false },
        { text: "START DATE", value: "startDate", sortable: false },
        { text: "END DATE", value: "endDate", sortable: false },
        { text: "CANCEL", value: "cancel", sortable: false },
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
    async getUserReservations() {
      const userId = localStorage.getItem("userId")
      const reservationsRef = collection(db, "reservations")
      const q = query(reservationsRef, where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const startDate = this.milisecondsToDate(doc.data().start_time)
        const endDate = this.milisecondsToDate(doc.data().end_time)
        console.log(startDate)
        this.reservations.push({
          title: doc.data().title,
          author: doc.data().author,
          inventoryNumber: doc.data().copyInvNumber,
          startDate,
          endDate,
        })
      })
    },
  },
  created() {
    this.getUserReservations()
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
