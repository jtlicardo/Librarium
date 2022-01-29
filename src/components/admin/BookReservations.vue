<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter (by book copy or user)"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="reservations"
      class="elevation-1"
      :loading="loading"
      :search="search"
    >
      <template v-slot:[`item.copy`]="{ item }">
        {{ item.title }}
        <br />
        {{ item.author }}
        <br />
        {{ item.copyInvNumber }}
      </template>
      <template v-slot:[`item.delete`]="{ item }">
        <v-icon class="delete" @click="deleteReservation(item)" v-if="!isMobile">
          mdi-trash-can-outline
        </v-icon>
        <v-btn
          color="red white--text"
          class="delete-button"
          @click="deleteReservation(item)"
          v-else
        >
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
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
      search: "",
      reservations: [],
    }
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "BOOK COPY",
          sortable: false,
          value: "copy",
          align: "center",
          filterable: false,
        },
        {
          text: "TITLE",
          value: "title",
          sortable: false,
          align: " d-none",
          filterable: true,
        },
        {
          text: "AUTHOR",
          value: "author",
          sortable: false,
          align: " d-none",
          filterable: true,
        },
        {
          text: "INVNUM",
          value: "copyInvNumber",
          sortable: false,
          align: " d-none",
          filterable: true,
        },
        {
          text: "USER",
          value: "user",
          sortable: false,
          align: "center",
          filterable: true,
        },
        {
          text: "START DATE",
          value: "startDate",
          sortable: false,
          align: "center",
          filterable: false,
        },
        {
          text: "END DATE",
          value: "endDate",
          sortable: false,
          align: "center",
          filterable: false,
        },
        {
          text: "DELETE",
          value: "delete",
          sortable: false,
          align: "center",
          filterable: false,
        },
      ]
      if (this.isMobile) {
        headers.splice(7, 1)
        headers.push({
          text: "",
          value: "delete",
          sortable: false,
          align: "center",
          filterable: "false",
        })
      }
      return headers
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true
        default:
          return false
      }
    },
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
      const querySnapshot = await getDocs(collection(db, "reservations"))
      querySnapshot.forEach((doc) => {
        const userId = doc.data().userId
        const startDate = this.milisecondsToDate(doc.data().start_time)
        const endDate = this.milisecondsToDate(doc.data().end_time)
        this.reservations.push({
          firebaseReservationId: doc.id,
          title: doc.data().title,
          author: doc.data().author,
          copyInvNumber: doc.data().copyInvNumber,
          firebaseUserId: userId,
          firebaseBookId: doc.data().bookId,
          firebaseStartTime: doc.data().start_time,
          firebaseEndTime: doc.data().end_time,
          user: userId,
          startDate,
          endDate,
        })
      })
      await this.changeAllIdsToEmails(this.reservations)
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
            inventoryNumber: item.copyInvNumber,
            status: "Reserved",
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: item.copyInvNumber,
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
  async created() {
    this.loading = true
    await this.getAllReservations()
    this.loading = false
  },
}
</script>

<style scoped>
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

.v-data-table
  >>> .v-data-table__wrapper
  > table
  > tbody
  > .v-data-table__mobile-table-row
  > .v-data-table__mobile-row:first-child
  > .v-data-table__mobile-row__cell {
  padding-top: 10px;
}

.v-data-table
  >>> .v-data-table__wrapper
  > table
  > tbody
  > .v-data-table__mobile-table-row
  > .v-data-table__mobile-row:nth-of-type(2),
.v-data-table
  >>> .v-data-table__wrapper
  > table
  > tbody
  > .v-data-table__mobile-table-row
  > .v-data-table__mobile-row:nth-of-type(3),
.v-data-table
  >>> .v-data-table__wrapper
  > table
  > tbody
  > .v-data-table__mobile-table-row
  > .v-data-table__mobile-row:nth-of-type(4) {
  display: none;
}

.delete {
  color: #f44336;
}

.delete:hover {
  color: red;
  transform: scale(1.2);
}
</style>
