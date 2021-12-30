<template>
  <v-data-table
    :headers="headers"
    :items="reservations"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.cancel`]>
      <v-icon color="red">mdi-trash-can-outline</v-icon>
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
      this.loading = false
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
