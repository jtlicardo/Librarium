<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-10">All loans</h1>
        <book-loans />
        <v-btn class="my-14" color="yellow darken-1" @click="addLoan">Add loan</v-btn>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookLoans from "@/components/admin/BookLoans.vue"

export default {
  components: {
    BookLoans,
  },
  methods: {
    addLoan() {
      this.$router.push({ name: "Add Loan" })
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
