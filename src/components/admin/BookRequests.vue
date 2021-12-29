<template>
  <v-data-table
    :headers="headers"
    :items="requests"
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
import { db, collection, getDocs } from "@/firebase.js"

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
  },
  created() {
    this.getBookRequests()
  },
}
</script>

<style scoped></style>
