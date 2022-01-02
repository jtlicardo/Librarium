<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-col cols="12" md="10">
        <h1 class="mb-10">Add loan</h1>
        <add-loan></add-loan>
      </v-col>
      <v-col cols="12" md="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddLoan from "@/components/admin/AddLoan.vue"

export default {
  components: {
    AddLoan,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
