<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Filter"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      :loading="loading"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
import { collection, query, where, db, getDocs } from "@/firebase.js"
export default {
  data() {
    return {
      loading: false,
      search: "",
      headers: [
        {
          text: "FULL NAME",
          sortable: false,
          value: "fullname",
          align: "center",
          filterable: true,
        },
        {
          text: "EMAIL",
          value: "email",
          sortable: false,
          align: "center",
          filterable: true,
        },
      ],
      users: [],
    }
  },
  methods: {
    async getAllUsers() {
      this.loading = true
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("isAdmin", "==", false))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.users.push({
          fullname: doc.data().fullname,
          email: doc.data().email,
        })
      })
      this.loading = false
    },
  },
  async created() {
    await this.getAllUsers()
  },
}
</script>

<style scoped></style>
