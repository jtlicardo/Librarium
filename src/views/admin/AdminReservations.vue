<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="0" xl="2"></v-col>
      <v-col cols="12" xl="8">
        <h1 class="mb-10">All reservations</h1>
        <book-reservations v-if="autodeleted" />
      </v-col>
      <v-col cols="0" xl="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookReservations from "@/components/admin/BookReservations.vue"
import {
  collection,
  db,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  where,
  deleteDoc,
  doc,
} from "@/firebase.js"

export default {
  components: {
    BookReservations,
  },
  data() {
    return {
      autodeleted: false,
    }
  },
  methods: {
    async autoDeleteReservations() {
      const querySnapshot = await getDocs(collection(db, "reservations"))
      let reservations = []
      querySnapshot.forEach((doc) => {
        if (doc.data().end_time < Date.now()) {
          reservations.push({
            id: doc.id,
            bookId: doc.data().bookId,
            inventoryNumber: doc.data().copyInvNumber,
            userId: doc.data().userId,
          })
        }
      })
      for (let reservation of reservations) {
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
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("uid", "==", reservation.userId))
        const querySnapshot = await getDocs(q)
        let selectedUser = ""
        querySnapshot.forEach((doc) => {
          selectedUser = doc.id
        })
        const users = doc(db, "users", selectedUser)
        await updateDoc(users, {
          reservations: arrayRemove(reservation.id),
        })
        await deleteDoc(doc(db, "reservations", reservation.id))
        console.log("Autodeleted reservation: ", reservation.id)
      }
    },
  },
  async mounted() {
    await this.autoDeleteReservations()
    this.autodeleted = true
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
