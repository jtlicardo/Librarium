<template>
  <v-data-table
    :headers="headers"
    :items="loans"
    hide-default-footer
    class="elevation-1"
    :loading="loading"
  >
    <template v-slot:[`item.copy`]="{ item }">
      {{ item.title }}
      <br />
      {{ item.author }}
      <br />
      {{ item.copyInvNumber }}
    </template>
    <template v-slot:[`item.loan_status`]="{ item }">
      <loan-status :type="item.loan_status"></loan-status>
    </template>
    <template v-slot:[`item.edit`]="{ item }">
      <v-icon color="primary" @click="editLoan(item)">mdi-circle-edit-outline</v-icon>
    </template>
    <template v-slot:[`item.accept`]="{ item }">
      <v-icon color="success" @click="acceptRequest(item)">mdi-check-outline</v-icon>
    </template>
    <template v-slot:[`item.deny`]="{ item }">
      <v-icon color="red" @click="denyRequest(item)">mdi-close-outline</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import {
  db,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from "@/firebase.js"
import LoanStatus from "@/components/LoanStatus.vue"
export default {
  props: {
    requests: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    LoanStatus,
  },
  data() {
    return {
      loading: false,
      loans: [],
    }
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "BOOK COPY",
          value: "copy",
          sortable: false,
          align: "center",
        },
        {
          text: "USER",
          value: "user",
          sortable: false,
          align: "center",
        },
        {
          text: "ISSUE DATE",
          value: "issue_date",
          sortable: false,
          align: "center",
        },
        {
          text: "DUE DATE",
          value: "due_date",
          sortable: false,
          align: "center",
        },
        {
          text: "RETURN DATE",
          value: "return_date",
          sortable: false,
          align: "center",
        },
        {
          text: "LOAN STATUS",
          value: "loan_status",
          sortable: false,
          align: "center",
        },
      ]
      if (!this.requests) {
        headers.push({
          text: "EDIT",
          value: "edit",
          sortable: false,
          align: "center",
        })
      }
      if (this.requests) {
        headers.splice(4, 1)
        headers.push(
          {
            text: "ACCEPT",
            value: "accept",
            sortable: false,
            align: "center",
          },
          {
            text: "DENY",
            value: "deny",
            sortable: false,
            align: "center",
          }
        )
      }

      return headers
    },
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
    async getAllLoans() {
      this.loading = true
      this.loans = []
      const querySnapshot = await getDocs(collection(db, "loans"))
      querySnapshot.forEach((doc) => {
        const issue_date = this.milisecondsToDate(doc.data().issue_time)
        const due_date = this.milisecondsToDate(doc.data().due_time)
        let return_date = ""
        if (doc.data().return_time !== null) {
          return_date = this.milisecondsToDate(doc.data().return_time)
        }
        this.loans.push({
          firebaseLoanId: doc.id,
          firebaseBookId: doc.data().bookId,
          firebaseIssueTime: doc.data().issue_time,
          firebaseDueTime: doc.data().due_time,
          firebaseReturnTime: doc.data().return_time,
          firebaseExtensionRequested: doc.data().extensionRequested,
          firebaseExtensionApproved: doc.data().extensionApproved,
          author: doc.data().author,
          copyInvNumber: doc.data().copyInvNumber,
          loan_status: doc.data().loan_status,
          title: doc.data().title,
          userId: doc.data().userId,
          issue_date,
          due_date,
          return_date,
        })
      })
      await this.changeAllIdsToEmails(this.loans)
      this.loading = false
    },
    async getRequests() {
      this.loading = true
      const loansRef = collection(db, "loans")
      const q = query(
        loansRef,
        where("extensionRequested", "==", true),
        where("extensionApproved", "==", null)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const issue_date = this.milisecondsToDate(doc.data().issue_time)
        const due_date = this.milisecondsToDate(doc.data().due_time)
        let return_date = ""
        if (doc.data().return_time !== null) {
          return_date = this.milisecondsToDate(doc.data().return_time)
        }
        this.loans.push({
          firebaseLoanId: doc.id,
          firebaseBookId: doc.data().bookId,
          firebaseIssueTime: doc.data().issue_time,
          firebaseDueTime: doc.data().due_time,
          firebaseReturnTime: doc.data().return_time,
          firebaseExtensionRequested: doc.data().extensionRequested,
          firebaseExtensionApproved: doc.data().extensionApproved,
          author: doc.data().author,
          copyInvNumber: doc.data().copyInvNumber,
          loan_status: doc.data().loan_status,
          title: doc.data().title,
          userId: doc.data().userId,
          issue_date,
          due_date,
          return_date,
        })
      })
      await this.changeAllIdsToEmails(this.loans)
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
    async changeAllIdsToEmails(loans) {
      for (let loan of loans) {
        const userId = loan.userId
        const email = await this.userIdToEmail(userId)
        loan.user = email
      }
    },
    editLoan(item) {
      this.$emit("edit-loan", item)
    },
    async acceptRequest(item) {
      try {
        const loansRef = doc(db, "loans", item.firebaseLoanId)
        await updateDoc(loansRef, {
          extensionApproved: true,
          due_time: increment(604800000),
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Request accepted!",
          isActive: true,
        })
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
    async denyRequest(item) {
      try {
        const loansRef = doc(db, "loans", item.firebaseLoanId)
        await updateDoc(loansRef, {
          extensionApproved: false,
        })
        this.$store.dispatch("displaySnackbar", {
          text: "Request denied!",
          isActive: true,
        })
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
    if (!this.requests) await this.getAllLoans()
    else await this.getRequests()
  },
}
</script>

<style></style>
