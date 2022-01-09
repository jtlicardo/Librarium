<template>
  <v-data-table
    :headers="headers"
    :items="bookCopies"
    hide-default-footer
    class="elevation-1 mx-auto"
    v-if="!!selectedBook"
  >
    <template v-slot:[`item.status`]="{ item }">
      <book-status :type="item.status" class="mx-auto" />
    </template>
    <template v-slot:[`item.loan`]="{ item }">
      <v-btn
        color="yellow darken-1"
        elevation="1"
        class="loan-button"
        v-if="item.status === 'Available' || item.inventoryNumber === userReservedCopy"
        @click="chooseCopy(item)"
      >
        LOAN
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import BookStatus from "@/components/book-details/BookStatus.vue"
import { db, collection, query, where, getDocs, doc, getDoc } from "@/firebase.js"

export default {
  props: ["title", "author", "logoUrl", "userEmail"],
  emits: ["copy-chosen"],
  components: {
    BookStatus,
  },
  data() {
    return {
      selectedBook: null,
      bookDocumentId: "",
      userReservedCopy: "",
      headers: [
        {
          text: "INVENTORY NUMBER",
          sortable: false,
          value: "inventoryNumber",
          align: "center",
        },
        { text: "STATUS", value: "status", sortable: false, align: "center" },
        { text: "", value: "loan", sortable: false, align: "right" },
      ],
    }
  },
  methods: {
    async getBookData() {
      this.selectedBook = null
      const booksRef = collection(db, "books")
      const q = query(
        booksRef,
        where("title", "==", this.title),
        where("author", "==", this.author),
        where("logoUrl", "==", this.logoUrl)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.bookDocumentId = doc.id
        this.selectedBook = doc.data()
      })
    },
    async getUserReservations() {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", this.userEmail))
      const querySnapshot = await getDocs(q)
      let reservationIds = []
      querySnapshot.forEach((doc) => {
        reservationIds = doc.data().reservations
      })
      return reservationIds
    },
    async getUserReservedCopies() {
      this.userReservedCopy = ""
      const reservationIds = await this.getUserReservations()
      for (let id of reservationIds) {
        const docRef = doc(db, "reservations", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().bookId === this.bookDocumentId) {
          this.userReservedCopy = docSnap.data().copyInvNumber
        } else {
          console.log("User has no reservations for selected book")
        }
      }
    },
    chooseCopy(item) {
      if (item.inventoryNumber === this.userReservedCopy) {
        item.userReservedCopy = true
      }
      this.$emit("copy-chosen", item)
    },
  },
  computed: {
    bookCopies() {
      return this.selectedBook.copies
    },
  },
  watch: {
    logoUrl() {
      this.getBookData()
      this.getUserReservedCopies()
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

.v-data-table__mobile-row__cell > button.loan-button {
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
