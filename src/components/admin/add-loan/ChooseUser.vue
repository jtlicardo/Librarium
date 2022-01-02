<template>
  <v-data-table
    :headers="headers"
    :items="users"
    hide-default-footer
    class="elevation-1 mx-auto"
    :loading="loading"
    @click:row="chooseUser"
  ></v-data-table>
</template>

<script>
import { collection, query, where, db, getDocs } from "@/firebase.js"
export default {
  emits: ["user-chosen"],
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
    chooseUser(data) {
      this.$emit("user-chosen", data)
    },
  },
  async created() {
    await this.getAllUsers()
  },
}
</script>

<style scoped>
ul li span::after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  content: "";
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr {
  transition: all 0.3s ease;
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr:hover {
  color: black;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  cursor: pointer;
}

.v-data-table {
  max-width: 600px !important;
}
</style>
