<template>
  <v-data-table
    :headers="headers"
    :items="bookCopies"
    hide-default-footer
    class="elevation-1 grey lighten-5"
    v-if="selectedBook"
  >
    <template v-slot:[`item.status`]="{ item }">
      <book-status :type="item.status" class="mx-auto" />
    </template>
    <template v-slot:[`item.reserve`]="{ item }" v-if="!userIsAdmin">
      <v-btn
        color="yellow darken-1"
        elevation="1"
        v-if="item.status === 'Available'"
        @click="reserveCopy(item)"
      >
        RESERVE
      </v-btn>
    </template>
    <template v-slot:[`item.delete`]="{ item }" v-if="userIsAdmin">
      <v-btn
        color="red white--text"
        elevation="1"
        @click="deleteCopy(item)"
        v-if="item.status === 'Available'"
      >
        DELETE
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import BookStatus from "@/components/book-details/BookStatus.vue"
import {
  doc,
  getDoc,
  db,
  updateDoc,
  arrayRemove,
  collection,
  addDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "@/firebase.js"

export default {
  props: ["id", "title", "author"],
  emits: ["copy-deleted", "copy-reserved"],
  components: {
    BookStatus,
  },
  data() {
    return {
      selectedBook: null,
      headers: [
        {
          text: "INVENTORY NUMBER",
          sortable: false,
          value: "inventoryNumber",
          align: "center",
        },
        { text: "STATUS", value: "status", sortable: false, align: "center" },
        { text: "", value: "reserve", sortable: false, align: "right" },
        { text: "", value: "delete", sortable: false, align: "right" },
      ],
    }
  },
  methods: {
    async getBookData() {
      const docRef = doc(db, "books", this.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.selectedBook = docSnap.data()
      } else {
        console.log("No such document!")
      }
    },
    async deleteCopy(item) {
      const inventoryNumber = item.inventoryNumber
      const status = item.status
      try {
        const booksRef = doc(db, "books", this.id)
        await updateDoc(booksRef, {
          copiesInvNums: arrayRemove(inventoryNumber),
        })
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: inventoryNumber,
            status: status,
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy successfully deleted!",
          isActive: true,
        })
        this.$emit("copy-deleted")
      } catch (e) {
        console.log(e)
        this.$store.dispatch("displayBaseDialog", {
          text: e.toString(),
          title: "Error! Please try again later.",
          color: "red",
          loading: false,
          active: true,
        })
      }
    },
    async reserveCopy(item) {
      const userId = localStorage.getItem("userId")
      const bookId = this.id
      const title = this.title
      const author = this.author
      const copyInvNumber = item.inventoryNumber
      const start_time = Date.now()
      const end_time = Date.now() + 259200000
      try {
        const docRef = await addDoc(collection(db, "reservations"), {
          userId,
          title,
          author,
          bookId,
          copyInvNumber,
          start_time,
          end_time,
        })
        console.log("Document written with ID: ", docRef.id)
        const users = collection(db, "users")
        const q = query(users, where("uid", "==", userId))
        const querySnapshot = await getDocs(q)
        let userDocId = ""
        querySnapshot.forEach((doc) => {
          userDocId = doc.id
        })
        const usersRef = doc(db, "users", userDocId)
        await updateDoc(usersRef, {
          reservations: arrayUnion(docRef.id),
        })
        const booksRef = doc(db, "books", this.id)
        await updateDoc(booksRef, {
          copies: arrayRemove({
            inventoryNumber: item.inventoryNumber,
            status: item.status,
          }),
        })
        await updateDoc(booksRef, {
          copies: arrayUnion({
            inventoryNumber: item.inventoryNumber,
            status: "Reserved",
          }),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Copy reserved!",
          isActive: true,
        })
        this.$emit("copy-reserved")
      } catch (e) {
        console.log(e)
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
  beforeMount() {
    this.getBookData()
  },
  computed: {
    bookCopies() {
      return this.selectedBook.copies
    },
    userIsAdmin() {
      const userIsAdmin = localStorage.getItem("userIsAdmin")
      const isAdmin = userIsAdmin === "true"
      if (isAdmin) return true
      else return false
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
</style>
