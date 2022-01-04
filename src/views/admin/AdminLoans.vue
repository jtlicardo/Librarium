<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-10">All loans</h1>
        <book-loans @edit-loan="openDialog" ref="loansComponent" />
        <v-btn class="my-14" color="yellow darken-1" @click="addLoan">Add loan</v-btn>
      </v-col>
      <v-col cols="12" md="1"></v-col>
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

export default {
  components: {
    BookLoans,
    EditLoan,
  },
  data() {
    return {
      active: false,
      loan: null,
    }
  },
  methods: {
    addLoan() {
      this.$router.push({ name: "Add Loan" })
      this.$store.dispatch("toggleHamburger")
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
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
