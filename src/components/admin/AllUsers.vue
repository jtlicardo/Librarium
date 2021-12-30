<template>
  <v-data-table
    :headers="headers"
    :items="users"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  ></v-data-table>
</template>

<script>
import { collection, query, where, db, getDocs } from "@/firebase.js"
export default {
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "FULL NAME",
          sortable: false,
          value: "fullname",
          align: "center",
        },
        {
          text: "EMAIL",
          value: "email",
          sortable: false,
          align: "center",
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
