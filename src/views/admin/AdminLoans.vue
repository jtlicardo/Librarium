<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="0" xl="2"></v-col>
      <v-col cols="12" xl="8">
        <h1 class="mb-10">All loans</h1>
        <book-loans @edit-loan="openDialog" ref="loansComponent" v-if="loansChecked" />
        <v-btn class="my-14" color="yellow darken-1" @click="addLoan">Add loan</v-btn>
      </v-col>
      <v-col cols="0" xl="2"></v-col>
    </v-row>
    <edit-loan
      :active="active"
      :loan="loan"
      @close-dialog="closeDialog"
      @refresh="getLoans"
    ></edit-loan>
  </v-container>
</template>

<script>
import BookLoans from "@/components/admin/BookLoans.vue"
import EditLoan from "@/components/admin/EditLoan.vue"
import { collection, db, getDocs, updateDoc, doc } from "@/firebase.js"

export default {
  components: {
    BookLoans,
    EditLoan,
  },
  data() {
    return {
      active: false,
      loan: null,
      loansChecked: false,
    }
  },
  methods: {
    addLoan() {
      this.$router.push({ name: "Add Loan" })
    },
    openDialog(loan) {
      this.loan = loan
      this.active = true
    },
    closeDialog() {
      this.active = false
    },
    getLoans() {
      this.$refs.loansComponent.getAllLoans()
    },
    async checkLoanStatus() {
      const querySnapshot = await getDocs(collection(db, "loans"))
      let loans = []
      querySnapshot.forEach((doc) => {
        if (
          doc.data().due_time < Date.now() &&
          doc.data().loan_status === "In progress"
        ) {
          loans.push({
            id: doc.id,
          })
        }
      })
      for (let loan of loans) {
        const loansRef = doc(db, "loans", loan.id)
        await updateDoc(loansRef, {
          loan_status: "Overdue",
        })
      }
      loans = []
      querySnapshot.forEach((doc) => {
        if (doc.data().due_time > Date.now() && doc.data().loan_status === "Overdue") {
          loans.push({
            id: doc.id,
          })
        }
      })
      for (let loan of loans) {
        const loansRef = doc(db, "loans", loan.id)
        await updateDoc(loansRef, {
          loan_status: "In progress",
        })
      }
    },
  },
  async mounted() {
    await this.checkLoanStatus()
    this.loansChecked = true
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
