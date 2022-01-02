<template>
  <v-data-table
    :headers="headers"
    :items="requests"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.delete`]="{ item }">
      <v-icon color="red" @click="deleteRequest(item)">mdi-trash-can-outline</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, getDocs, deleteDoc, query, where, doc } from "@/firebase.js"

export default {
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "TITLE",
          sortable: false,
          value: "title",
          align: "center",
        },
        {
          text: "AUTHOR",
          value: "author",
          sortable: false,
          align: "center",
        },
        {
          text: "DELETE",
          value: "delete",
          sortable: false,
          align: "center",
        },
      ],
      requests: [],
    }
  },
  methods: {
    async getBookRequests() {
      const querySnapshot = await getDocs(collection(db, "bookRequests"))
      querySnapshot.forEach((doc) => {
        this.requests.push(doc.data())
      })
    },
    async deleteRequest(item) {
      try {
        const bookRequestsRef = collection(db, "bookRequests")
        const q = query(
          bookRequestsRef,
          where("title", "==", item.title),
          where("author", "==", item.author)
        )
        let id = ""
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          id = doc.id
        })
        await deleteDoc(doc(db, "bookRequests", id))
        this.$store.dispatch("displaySnackbar", {
          text: "Request deleted!",
          isActive: true,
        })
        this.requests = []
        await this.getBookRequests()
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
    this.getBookRequests()
  },
}
</script>

<style scoped></style>
