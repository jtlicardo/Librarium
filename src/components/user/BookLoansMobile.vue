<template>
  <v-data-table
    :headers="headerTitles"
    :items="loans"
    :single-expand="singleExpand"
    item-key="title"
    show-expand
    hide-default-header
    hide-default-footer
    class="elevation-1"
    :loading="loading"
    @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
  >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length" class="py-5">
        <b class="text-h6">LOAN DETAILS</b>
        <p class="my-0">
          <b>Book title:</b>
          {{ item.title }}
        </p>
        <p class="my-0">
          <b>Author:</b>
          {{ item.author }}
        </p>
        <p class="my-0">
          <b>Inventory number:</b>
          {{ item.inventoryNumber }}
        </p>
        <p class="my-0">
          <b>Issue date:</b>
          {{ item.issueDate }}
        </p>
        <p class="my-0">
          <b>Due date:</b>
          {{ item.dueDate }}
        </p>
        <p
          class="my-0"
          v-if="item.extensionRequested === true && item.extensionApproved === null"
        >
          <b>Request status:</b>
          Sent
        </p>
        <p
          class="my-0"
          v-if="item.extensionRequested === true && item.extensionApproved === false"
        >
          <b>Request status:</b>
          Denied
        </p>
        <p
          class="my-0"
          v-if="item.extensionRequested === true && item.extensionApproved === true"
        >
          <b>Request status:</b>
          Approved
        </p>
        <v-btn
          v-if="item.extensionRequested === false"
          class="mt-3 black--text"
          color="yellow darken-1"
        >
          SEND REQUEST
        </v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { db, collection, query, where, getDocs } from "@/firebase.js"

export default {
  data() {
    return {
      singleExpand: true,
      loading: false,
      headerTitles: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "title",
        },
        {
          text: "",
          value: "data-table-expand",
        },
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
      const q = query(loansRef, where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.loans.push({
          firebaseLoanId: doc.id,
          author: doc.data().author,
          title: doc.data().title,
          firebaseBookId: doc.data().bookId,
          inventoryNumber: doc.data().copyInvNumber,
          firebaseDueTime: doc.data().due_time,
          dueDate: this.milisecondsToDate(doc.data().due_time),
          firebaseIssueTime: doc.data().issue_time,
          issueDate: this.milisecondsToDate(doc.data().issue_time),
          extensionApproved: doc.data().extensionApproved,
          extensionRequested: doc.data().extensionRequested,
          loanStatus: doc.data().loan_status,
        })
      })
      this.loading = false
    },
  },
  async created() {
    await this.getUserLoans()
  },
}
</script>

<style scoped>
.v-data-table {
  max-width: 100% !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
