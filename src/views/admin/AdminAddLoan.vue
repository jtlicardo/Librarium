<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-10">Add loan</h1>
        <add-loan v-if="!loanChosen" @loan-chosen="displayData"></add-loan>
        <loan-confirmation></loan-confirmation>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddLoan from "@/components/admin/AddLoan.vue"
import LoanConfirmation from "@/components/admin/LoanConfirmation.vue"

export default {
  components: {
    AddLoan,
    LoanConfirmation,
  },
  data() {
    return {
      loanChosen: false,
      user: null,
      book: null,
      copy: null,
    }
  },
  methods: {
    displayData(payload) {
      this.user = payload.user
      this.book = payload.book
      this.copy = payload.copy
      this.loanChosen = true
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
