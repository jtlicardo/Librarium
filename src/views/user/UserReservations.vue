<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="2"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-5">My reservations</h1>
        <p class="mb-0">A list of all your active reservations.</p>
        <p class="mb-10">
          Each user is allowed to have 3 reservations; 1 reservation per book.
        </p>
        <book-reservations-mobile v-if="isMobile" />
        <book-reservations v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookReservationsMobile from "@/components/user/BookReservationsMobile.vue"
import BookReservations from "@/components/user/BookReservations.vue"
import {
  collection,
  db,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
} from "@/firebase.js"

export default {
  components: {
    BookReservations,
    BookReservationsMobile,
  },
  computed: {
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
    async autoDeleteUserReservations() {
      const userId = localStorage.getItem("userId")
      const reservationsRef = collection(db, "reservations")
      const q = query(reservationsRef, where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      let reservations = []
      querySnapshot.forEach((doc) => {
        if (doc.data().end_time < Date.now()) {
          reservations.push({
            id: doc.id,
            bookId: doc.data().bookId,
            inventoryNumber: doc.data().copyInvNumber,
          })
        }
      })
      for (let reservation of reservations) {
        // update copy status
        const booksRef = doc(db, "books", reservation.bookId)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: reservation.inventoryNumber,
            status: "Reserved",
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: reservation.inventoryNumber,
            status: "Available",
          }),
        })
        // remove reservation id from users collection
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("uid", "==", userId))
        const querySnapshot = await getDocs(q)
        let selectedUser = ""
        querySnapshot.forEach((doc) => {
          selectedUser = doc.id
        })
        const users = doc(db, "users", selectedUser)
        await updateDoc(users, {
          reservations: arrayRemove(reservation.id),
        })
        // delete reservation
        await deleteDoc(doc(db, "reservations", reservation.id))
        console.log("Autodeleted reservation: ", reservation.id)
      }
    },
  },
  async mounted() {
    await this.autoDeleteUserReservations()
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
