<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1" lg="1" xl="1"></v-col>
      <v-col cols="12" md="9" lg="7" xl="5">
        <h1 class="mb-10">Books users have requested</h1>
        <book-requests></book-requests>
      </v-col>
      <v-col cols="12" md="2" lg="4" xl="6"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="my-10">Loan extension requests</h1>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import BookRequests from "@/components/admin/BookRequests.vue"
export default {
  components: {
    BookRequests,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
