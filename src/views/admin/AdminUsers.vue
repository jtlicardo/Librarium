<template>
  <v-container class="mt-md-10">
    <v-row>
      <v-col cols="12" md="1" lg="1" xl="1"></v-col>
      <v-col cols="12" md="9" lg="7" xl="5">
        <h1 class="mb-10">All users</h1>
        <all-users></all-users>
      </v-col>
      <v-col cols="12" md="2" lg="4" xl="6"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import AllUsers from "@/components/admin/AllUsers.vue"
export default {
  components: {
    AllUsers,
  },
}
</script>

<style scoped>
h1 {
  font-weight: 400;
}
</style>
