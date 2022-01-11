<template>
  <v-data-table
    :headers="headers"
    :items="requests"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.delete`]="{ item }">
      <v-icon class="delete" @click="deleteRequest(item)" v-if="!isMobile">
        mdi-trash-can-outline
      </v-icon>
      <v-btn
        color="red white--text"
        class="delete-button"
        @click="deleteRequest(item)"
        v-else
      >
        Delete
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, getDocs, deleteDoc, query, where, doc } from "@/firebase.js"

export default {
  data() {
    return {
      loading: false,
      requests: [],
    }
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true
        default:
          return false
      }
    },
    headers() {
      let headers = [
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
          text: "USER",
          value: "user",
          sortable: false,
          align: "center",
        },
      ]
      if (this.isMobile)
        headers.push({
          text: "",
          value: "delete",
          sortable: false,
          align: "center",
        })
      else
        headers.push({
          text: "DELETE",
          value: "delete",
          sortable: false,
          align: "center",
        })
      return headers
    },
  },
  methods: {
    async getBookRequests() {
      this.loading = true
      const querySnapshot = await getDocs(collection(db, "bookRequests"))
      querySnapshot.forEach(async (doc) => {
        this.requests.push({
          title: doc.data().title,
          author: doc.data().author,
          user: await this.userIdToEmail(doc.data().userId),
        })
      })
      this.loading = false
    },
    async userIdToEmail(userId) {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("uid", "==", userId))
      const querySnapshot = await getDocs(q)
      let email = ""
      querySnapshot.forEach((doc) => {
        email = doc.data().email
      })
      return email
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

<style scoped>
.v-data-table__mobile-row__cell > button.delete-button {
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

.delete {
  color: #f44336;
}

.delete:hover {
  color: red;
  transform: scale(1.2);
}
</style>
