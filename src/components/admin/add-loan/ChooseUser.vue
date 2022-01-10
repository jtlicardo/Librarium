<template>
  <v-card width="600px" class="mx-auto">
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
      hide-default-footer
      class="elevation-1 mx-auto"
      :loading="loading"
      @click:row="chooseUser"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
import { collection, query, where, db, getDocs } from "@/firebase.js"
export default {
  emits: ["user-chosen"],
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
    async getUsers() {
      this.loading = true
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("isAdmin", "==", false))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        if (doc.data().loans.length < 3) {
          this.users.push({
            fullname: doc.data().fullname,
            email: doc.data().email,
          })
        }
      })
      this.loading = false
    },
    chooseUser(data) {
      this.$emit("user-chosen", data)
    },
  },
  async created() {
    await this.getUsers()
  },
}
</script>

<style scoped>
.v-data-table >>> .v-data-table__wrapper > table > tbody > tr {
  transition: all 0.3s ease;
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr:hover {
  color: black;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  cursor: pointer;
}
</style>
