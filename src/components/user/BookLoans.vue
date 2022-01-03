<template>
  <v-data-table
    :headers="headers"
    :items="loans"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.request`]="{ item }">
      <v-icon
        v-if="item.firebaseExtensionRequested === false"
        color="primary"
        @click="requestLoanExtension(item)"
      >
        mdi-calendar-clock
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, query, where, getDocs, updateDoc, doc } from "@/firebase.js"
export default {
  data() {
    return {
      loading: false,
      headers: [
        {
          text: "BOOK TITLE",
          sortable: false,
          value: "title",
          align: "center",
        },
        { text: "AUTHOR", value: "author", sortable: false, align: "center" },
        {
          text: "INVENTORY NUMBER",
          value: "inventoryNumber",
          sortable: false,
          align: "center",
        },
        { text: "ISSUE DATE", value: "issueDate", sortable: false, align: "center" },
        { text: "DUE DATE", value: "dueDate", sortable: false, align: "center" },
        { text: "REQUEST", value: "request", sortable: false, align: "center" },
      ],
      loans: [],
    }
  },
  methods: {
    milisecondsToDate(miliseconds) {
      let date = new Date(miliseconds)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const result = day + "." + month + "." + year + "."
      return result
    },
    async getUserLoans() {
      this.loading = true
      const userId = localStorage.getItem("userId")
      const loansRef = collection(db, "loans")
      const q = query(
        loansRef,
        where("userId", "==", userId),
        where("loan_status", "!=", "Finished")
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const issueDate = this.milisecondsToDate(doc.data().issue_time)
        const dueDate = this.milisecondsToDate(doc.data().due_time)
        this.loans.push({
          firebaseLoanId: doc.id,
          firebaseBookId: doc.data().bookId,
          firebaseIssueTime: doc.data().issue_time,
          firebaseDueTime: doc.data().due_time,
          firebaseExtensionRequested: doc.data().extensionRequested,
          firebaseExtensionApproved: doc.data().extensionApproved,
          firebaseLoanStatus: doc.data().loan_status,
          author: doc.data().author,
          inventoryNumber: doc.data().copyInvNumber,
          title: doc.data().title,
          issueDate,
          dueDate,
        })
      })
      this.loading = false
    },
    async requestLoanExtension(item) {
      const id = item.firebaseLoanId
      try {
        const loansRef = doc(db, "loans", id)
        await updateDoc(loansRef, {
          extensionRequested: true,
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Request sent!",
          isActive: true,
        })
        this.loans = []
        await this.getUserLoans()
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
  async created() {
    await this.getUserLoans()
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 80% !important;
}

@media only screen and (max-width: 1264px) {
  .v-data-table {
    max-width: 100% !important;
  }
}

.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
