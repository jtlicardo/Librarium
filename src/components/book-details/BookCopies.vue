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
      <v-btn color="yellow darken-1" elevation="1" v-if="item.status === 'Available'">
        RESERVE
      </v-btn>
    </template>
    <template v-slot:[`item.delete`]="{ item }" v-if="userIsAdmin">
      <v-btn color="red white--text" elevation="1" @click="deleteCopy(item)">
        DELETE
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import BookStatus from "@/components/book-details/BookStatus.vue"
import { doc, getDoc, db, updateDoc, arrayRemove } from "@/firebase.js"

export default {
  props: ["id"],
  emits: ["copy-deleted"],
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
